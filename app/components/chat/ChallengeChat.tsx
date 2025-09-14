import type { Message } from 'ai';
import React, { type RefCallback } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { Workbench } from '~/components/workbench/Workbench.client';
import { classNames } from '~/utils/classNames';
import { type Challenge } from '~/lib/challenges';
import { Messages } from './Messages.client';
import { SendButton } from './SendButton.client';
import { ChallengeTimer } from '~/components/challenge/ChallengeTimer';

import styles from './BaseChat.module.scss';

interface ChallengeChatProps {
  challenge: Challenge;
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  input?: string;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TEXTAREA_MIN_HEIGHT = 76;

export const ChallengeChat = React.forwardRef<HTMLDivElement, ChallengeChatProps>(
  (
    {
      challenge,
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      messages,
      input = '',
      sendMessage,
      handleInputChange,
      handleStop,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;

    return (
      <div
        ref={ref}
        className={classNames(
          styles.BaseChat,
          'relative flex h-full w-full overflow-hidden bg-bolt-elements-background-depth-1',
        )}
        data-chat-visible={showChat}
      >
        {chatStarted && false && (
          <ChallengeTimer
            start={chatStarted}
            duration={challenge.difficulty === 'Easy' ? 10 * 60 : challenge.difficulty === 'Medium' ? 15 * 60 : 20 * 60}
            challenge={challenge}
          />
        )}
        <div ref={scrollRef} className="flex overflow-y-auto w-full h-full">
          <div className={classNames(styles.Chat, 'flex flex-col flex-grow min-w-[var(--chat-min-width)] h-full')}>
            {!chatStarted && (
              <div id="challenge-intro" className="mt-16 max-w-chat mx-auto text-center">
                <img
                  src={challenge.image}
                  alt={challenge.title}
                  className="mx-auto mb-6 rounded-lg shadow-md max-h-80 max-w-full"
                />
                <div className="mb-4">
                  <h1 className="text-3xl text-white font-bold mb-4">{challenge.title}</h1>
                  <span
                    className={classNames(
                      'inline-block px-3 py-1 rounded-full text-sm font-semibold',
                      challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : '',
                      challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : '',
                      challenge.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : '',
                    )}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
                <div className="mb-4 text-bolt-elements-textSecondary space-y-2">
                  <hr className="my-6 border-t border-bolt-elements-borderColor w-1/2 mx-auto" />
                  <p className="text-sm font-medium text-bolt-elements-textTertiary mb-2">
                    Your challenge timer will start right after the first prompt
                  </p>
                </div>
              </div>
            )}
            <div
              className={classNames('pt-10 px-6', {
                'h-full flex flex-col': chatStarted,
              })}
            >
              <ClientOnly>
                {() => {
                  return chatStarted ? (
                    <Messages
                      ref={messageRef}
                      className="flex flex-col w-full flex-1 max-w-chat px-4 pb-6 mx-auto z-1"
                      messages={messages}
                      isStreaming={isStreaming}
                    />
                  ) : null;
                }}
              </ClientOnly>
              <div
                className={classNames('relative w-full max-w-chat mx-auto z-prompt', {
                  'sticky bottom-0': chatStarted,
                })}
              >
                <div
                  className={classNames(
                    'shadow-sm border border-bolt-elements-borderColor bg-bolt-elements-prompt-background backdrop-filter backdrop-blur-[8px] rounded-lg overflow-hidden pb-8',
                  )}
                >
                  <textarea
                    ref={textareaRef}
                    className={`w-full pl-4 pt-4 pr-16 focus:outline-none resize-none text-md text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent`}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        if (event.shiftKey) {
                          return;
                        }

                        event.preventDefault();

                        sendMessage?.(event);
                      }
                    }}
                    value={input}
                    onChange={(event) => {
                      handleInputChange?.(event);
                    }}
                    style={{
                      minHeight: TEXTAREA_MIN_HEIGHT,
                      maxHeight: TEXTAREA_MAX_HEIGHT,
                    }}
                    placeholder="Start vibe coding here..."
                    translate="no"
                  />
                  <ClientOnly>
                    {() => (
                      <SendButton
                        show={input.length > 0 || isStreaming}
                        isStreaming={isStreaming}
                        onClick={(event) => {
                          if (isStreaming) {
                            handleStop?.();
                            return;
                          }

                          sendMessage?.(event);
                        }}
                      />
                    )}
                  </ClientOnly>
                  {input.length > 3 ? (
                    <div className="flex justify-end text-sm p-4 pt-2">
                      <div className="text-xs text-bolt-elements-textTertiary">
                        Use <kbd className="kdb">Shift</kbd> + <kbd className="kdb">Return</kbd> for a new line
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="bg-bolt-elements-background-depth-1 pb-6">{/* Ghost Element */}</div>
              </div>
            </div>
          </div>
          <ClientOnly>{() => <Workbench chatStarted={chatStarted} isStreaming={isStreaming} />}</ClientOnly>
        </div>
      </div>
    );
  },
);
