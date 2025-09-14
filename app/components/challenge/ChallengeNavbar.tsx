import { BackToChallengesButton } from './BackToChallengesButton';
import { ChallengeTimer } from './ChallengeTimer';

export function ChallengeNavbar({
  challenge,
  timerProps,
  onSubmit,
}: {
  challenge: { id: string };
  timerProps: {
    start: boolean;
    duration?: number;
    onExpire?: () => void;
  };
  onSubmit?: () => void;
}) {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-bolt-elements-background-depth-2 border-b border-bolt-elements-borderColor shadow z-50 relative">
      <div className="flex items-center h-full">
        <BackToChallengesButton />
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 rounded bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text font-semibold shadow border border-bolt-elements-borderColor transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-bolt-elements-accent/60"
          onClick={onSubmit}
          type="button"
        >
          Submit
        </button>
        <ChallengeTimer {...timerProps} challenge={challenge} />
      </div>
    </nav>
  );
}
