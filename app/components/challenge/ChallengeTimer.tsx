import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { SubmissionConfirmation } from './SubmissionConfirmation';

export function ChallengeTimer({
  start,
  duration = 20 * 60,
  onExpire,
  challenge,
  onPreSubmission,
  onSubmission,
}: {
  start: boolean;
  duration?: number;
  onExpire?: () => void;
  challenge: { id: string };
  onPreSubmission?: () => void;
  onSubmission?: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!start) {
      return;
    }

    if (intervalRef.current) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;

          if (onExpire) {
            onExpire();
          }

          return 0;
        }

        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [start, onExpire]);

  const handlePreSubmission = () => {
    if (onPreSubmission) {
      onPreSubmission();
    }
  };

  const handleSubmission = () => {
    if (onSubmission) {
      onSubmission();
    }

    console.log(`Challenge: ${JSON.stringify(challenge)}`);

    // Always execute the default submission logic
    if (challenge?.id) {
      localStorage.setItem(`challenge-solved-${challenge.id}`, '1');
      window.dispatchEvent(new CustomEvent('challenge:submit', { detail: { id: challenge.id } }));
    }

    // TODO get the users mark here
    const promptScore = 5;
    const qualityScore = 100;
    const speedScore = 5;

    // Redirect to landing page
    navigate('/result?prompt_score=5&quality_score=100&speed_score=5');
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary px-4 py-2 rounded-lg shadow font-bold text-lg flex items-center gap-2 select-none">
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="inline-block mr-1">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M10 5v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {minutes}:{seconds.toString().padStart(2, '0')}
      <SubmissionConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onPreSubmission={handlePreSubmission}
        onSubmission={handleSubmission}
        challenge={challenge}
      />
    </div>
  );
}
