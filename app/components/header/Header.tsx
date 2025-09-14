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
        'w-full bg-bolt-elements-background-depth-1 border-b border-bolt-elements-borderColor shadow-sm z-20',
        className,
      )}
    >
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-3">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logoooo-removebg-preview.png"
            alt="Promptly Logo"
            className="h-10 w-10 object-contain rounded-full bg-white/80 shadow group-hover:scale-105 transition-transform"
          />
          <span className="text-2xl font-extrabold tracking-tight text-bolt-elements-textPrimary group-hover:text-bolt-elements-accent transition-colors select-none">
            Promptly
          </span>
        </Link>
        {/* Navigation */}
        <nav className="flex items-center gap-2 md:gap-6 text-base font-semibold">
          <Link
            to="/"
            className={classNames(
              'px-4 py-2 rounded-md transition-colors',
              location.pathname === '/'
                ? 'bg-bolt-elements-background-depth-2 text-bolt-elements-accent shadow'
                : 'text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2/70',
            )}
          >
            Challenges
          </Link>
          <Link
            to="/profile"
            className={classNames(
              'px-4 py-2 rounded-md transition-colors',
              location.pathname === '/profile'
                ? 'bg-bolt-elements-background-depth-2 text-bolt-elements-accent shadow'
                : 'text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2/70',
            )}
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
