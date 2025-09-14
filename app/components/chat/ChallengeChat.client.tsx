import { useStore } from '@nanostores/react';
import type { Message } from 'ai';
import { useChat } from 'ai/react';
import { useAnimate } from 'framer-motion';
import { useRef, useEffect, useState, memo } from 'react';
import { cssTransition, toast, ToastContainer } from 'react-toastify';
import { useMessageParser, useShortcuts, useSnapScroll } from '~/lib/hooks';
import { useChatHistory } from '~/lib/persistence';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { type Challenge } from '~/lib/challenges';
import { setChallengeContext } from '~/lib/challengeSession';
import { fileModificationsToHTML } from '~/utils/diff';
import { cubicEasingFn } from '~/utils/easings';
import { createScopedLogger, renderLogger } from '~/utils/logger';
import { ChallengeChat as ChallengeChatBase } from './ChallengeChat';

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
});

const logger = createScopedLogger('ChallengeChat');

interface ChallengeChatClientProps {
  challenge: Challenge;
}

export function ChallengeChatClient({ challenge }: ChallengeChatClientProps) {
  renderLogger.trace('ChallengeChat');

  const { ready, initialMessages, storeMessageHistory } = useChatHistory();

  return (
    <>
      {ready && (
        <ChallengeChatImpl
          challenge={challenge}
          initialMessages={initialMessages}
          storeMessageHistory={storeMessageHistory}
        />
      )}
      <ToastContainer
        closeButton={({ closeToast }) => {
          return (
            <button className="Toastify__close-button" onClick={closeToast}>
              <div className="i-ph:x text-lg" />
            </button>
          );
        }}
        icon={({ type }) => {
          /**
           * @todo Handle more types if we need them. This may require extra color palettes.
           */
          switch (type) {
            case 'success': {
              return <div className="i-ph:check-bold text-bolt-elements-icon-success text-2xl" />;
            }
            case 'error': {
              return <div className="i-ph:warning-circle-bold text-bolt-elements-icon-error text-2xl" />;
            }
          }

          return undefined;
        }}
        position="bottom-right"
        pauseOnFocusLoss
        transition={toastAnimation}
      />
    </>
  );
}

interface ChallengeChatProps {
  challenge: Challenge;
  initialMessages: Message[];
  storeMessageHistory: (messages: Message[]) => Promise<void>;
}

export const ChallengeChatImpl = memo(({ challenge, initialMessages, storeMessageHistory }: ChallengeChatProps) => {
  useShortcuts();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [chatStarted, setChatStarted] = useState(initialMessages.length > 0);

  const { showChat } = useStore(chatStore);

  const [animationScope, animate] = useAnimate();

  const { messages, isLoading, input, handleInputChange, setInput, stop, append } = useChat({
    api: '/api/chat',
    onError: (error) => {
      logger.error('Request failed\n\n', error);
      toast.error('There was an error processing your request');
    },
    onFinish: () => {
      logger.debug('Finished streaming');
    },
    initialMessages,
  });

  const { parsedMessages, parseMessages } = useMessageParser();

  const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

  useEffect(() => {
    chatStore.setKey('started', initialMessages.length > 0);
  }, []);

  useEffect(() => {
    parseMessages(messages, isLoading);

    if (messages.length > initialMessages.length) {
      storeMessageHistory(messages).catch((error) => toast.error(error.message));
    }
  }, [messages, isLoading, parseMessages]);

  const scrollTextArea = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  };

  const abort = () => {
    stop();
    chatStore.setKey('aborted', true);
    workbenchStore.abortAllActions();
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = 'auto';

      const scrollHeight = textarea.scrollHeight;

      textarea.style.height = `${Math.min(scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
      textarea.style.overflowY = scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
    }
  }, [input, textareaRef]);

  const runAnimation = async () => {
    if (chatStarted) {
      return;
    }

    await Promise.all([animate('#challenge-intro', { opacity: 0, flex: 1 }, { duration: 0.2, ease: cubicEasingFn })]);

    chatStore.setKey('started', true);

    setChatStarted(true);
  };

  const sendMessage = async (_event: React.UIEvent, messageInput?: string) => {
    const _input = messageInput || input;

    if (_input.length === 0 || isLoading) {
      return;
    }

    // store challenge context when first message is sent
    if (messages.length === 0) {
      setChallengeContext(challenge.id, challenge);
    }

    /**
     * @note (delm) Usually saving files shouldn't take long but it may take longer if there
     * many unsaved files. In that case we need to block user input and show an indicator
     * of some kind so the user is aware that something is happening. But I consider the
     * happy case to be no unsaved files and I would expect users to save their changes
     * before they send another message.
     */
    await workbenchStore.saveAllFiles();

    const fileModifications = workbenchStore.getFileModifcations();

    chatStore.setKey('aborted', false);

    runAnimation();

    if (fileModifications !== undefined) {
      const diff = fileModificationsToHTML(fileModifications);

      /**
       * If we have file modifications we append a new user message manually since we have to prefix
       * the user input with the file modifications and we don't want the new user input to appear
       * in the prompt. Using `append` is almost the same as `handleSubmit` except that we have to
       * manually reset the input and we'd have to manually pass in file attachments. However, those
       * aren't relevant here.
       */
      append({ role: 'user', content: `${diff}\n\n${_input}` });

      /**
       * After sending a new message we reset all modifications since the model
       * should now be aware of all the changes.
       */
      workbenchStore.resetAllFileModifications();
    } else {
      append({ role: 'user', content: _input });
    }

    setInput('');

    textareaRef.current?.blur();
  };

  const [messageRef, scrollRef] = useSnapScroll();

  const [timer, setTimer] = useState(20 * 60); // 20 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  // start timer when chatStarted becomes true for the first time
  useEffect(() => {
    if (chatStarted && !timerActive) {
      setTimerActive(true);
    }
  }, [chatStarted, timerActive]);

  // countdown effect
  useEffect(() => {
    if (!timerActive) {
      return;
    }

    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timerActive, timer]);

  // format timer as MM:SS
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');

    return `${m}:${s}`;
  };

  return (
    <div>
      {chatStarted && timerActive && timer > 0 && (
        <div className="fixed top-4 right-4 z-50 bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary px-6 py-3 rounded-lg shadow-lg text-2xl font-bold border border-bolt-elements-borderColor">
          Time Left: {formatTimer(timer)}
        </div>
      )}
      <ChallengeChatBase
        ref={animationScope}
        challenge={challenge}
        textareaRef={textareaRef}
        input={input}
        showChat={showChat}
        chatStarted={chatStarted}
        isStreaming={isLoading}
        sendMessage={sendMessage}
        messageRef={messageRef}
        scrollRef={scrollRef}
        handleInputChange={handleInputChange}
        handleStop={abort}
        messages={messages.map((message, i) => {
          if (message.role === 'user') {
            return message;
          }

          return {
            ...message,
            content: parsedMessages[i] || '',
          };
        })}
      />
    </div>
  );
});
