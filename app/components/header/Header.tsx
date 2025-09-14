import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { Link, useLocation } from '@remix-run/react';

export function Header({ className = '' }: { className?: string } = {}) {
  const chat = useStore(chatStore);
  const location = useLocation();

  return (
    <header
      className={classNames(
        'flex flex-col bg-bolt-elements-background-depth-1 p-0 border-b h-[var(--header-height)] z-10',
        className,
        {
          'border-transparent': !chat.started,
          'border-bolt-elements-borderColor': chat.started,
        },
      )}
    >
      <div className="flex items-center w-full max-w-6xl mx-auto justify-between pt-8 pb-8 px-6 min-h-[72px]">
        <nav className="flex gap-0 justify-center flex-1">
          <Link
            to="/"
            className={classNames(
              'px-6 py-2 rounded-l text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2 transition relative',
              { 'bg-bolt-elements-background-depth-2 font-bold': location.pathname === '/' },
            )}
          >
            Challenges
            <span
              className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-px bg-bolt-elements-borderColor"
              style={{ pointerEvents: 'none' }}
            />
          </Link>
          <Link
            to="/profile"
            className={classNames(
              'px-6 py-2 rounded-r text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2 transition',
              { 'bg-bolt-elements-background-depth-2 font-bold': location.pathname === '/profile' },
            )}
            style={{ borderRadius: '0 0.5rem 0.5rem 0', borderBottom: 'none', borderTop: 'none' }}
          >
            Profile
          </Link>
        </nav>
      </div>
      <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
        <ClientOnly>{() => <ChatDescription />}</ClientOnly>
      </span>
      {chat.started && (
        <ClientOnly>
          {() => (
            <div className="mr-1">
              <HeaderActionButtons />
            </div>
          )}
        </ClientOnly>
      )}
    </header>
  );
}
