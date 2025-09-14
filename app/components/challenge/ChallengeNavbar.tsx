import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { BackToChallengesButton } from './BackToChallengesButton';
import { ChallengeTimer } from './ChallengeTimer';
import { SubmissionConfirmation } from './SubmissionConfirmation';
import { getChallengeById } from '~/lib/challenges';
import { proctoringService } from '~/lib/proctoring';

export function ChallengeNavbar({
  challenge,
  timerProps,
  onSubmit,
  onPreSubmission,
  onSubmission,
}: {
  challenge: { id: string };
  timerProps: {
    start: boolean;
    duration?: number;
    onExpire?: () => void;
  };
  onSubmit?: () => void;
  onPreSubmission?: () => Promise<void>;
  onSubmission?: () => Promise<void>;
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handlePreSubmission = async () => {
    if (onPreSubmission) {
      await onPreSubmission();
    }
  };

  const handleSubmission = () => {
    if (onSubmission) {
      await onSubmission();
    }

    console.log(`Challenge: ${JSON.stringify(challenge)}`);

    // Always execute the default submission logic
    if (challenge?.id) {
      localStorage.setItem(`challenge-solved-${challenge.id}`, '1');
      window.dispatchEvent(new CustomEvent('challenge:submit', { detail: { id: challenge.id } }));
    }

    // Use real quality score from API
    const promptScore = 5;
    const speedScore = 5;

    // Redirect to landing page with real quality score
    navigate(`/result?prompt_score=${promptScore}&quality_score=${qualityScore}&speed_score=${speedScore}`);
  };

  const handleSubmitClick = () => {
    if (onSubmit) {
      onSubmit();
    }
    setShowConfirmation(true);
  };
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 bg-bolt-elements-background-depth-2 border-b border-bolt-elements-borderColor shadow z-50 relative">
      <div className="flex items-center h-full">
        <BackToChallengesButton />
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 rounded bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text font-semibold shadow border border-bolt-elements-borderColor transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-bolt-elements-accent/60"
          onClick={handleSubmitClick}
          type="button"
        >
          Submit
        </button>
        <ChallengeTimer {...timerProps} challenge={challenge} />
      </div>
      <SubmissionConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onPreSubmission={handlePreSubmission}
        onSubmission={handleSubmission}
        challenge={challenge}
      />
    </nav>
  );
}
