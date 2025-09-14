import React, { useState } from 'react';
import { Dialog, DialogRoot, DialogTitle, DialogDescription, DialogButton, DialogClose } from '../ui/Dialog';

export interface SubmissionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onPreSubmission: () => Promise<void>;
  onSubmission: () => Promise<void>;
  onGradingStart?: () => void;
  onGradingComplete?: () => void;
  challenge: { id: string };
}

export function SubmissionConfirmation({
  isOpen,
  onClose,
  onPreSubmission,
  onSubmission,
  onGradingStart,
  onGradingComplete,
  challenge,
}: SubmissionConfirmationProps) {
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [screenshotCaptured, setScreenshotCaptured] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingComplete, setGradingComplete] = useState(false);

  const handleConfirmSubmission = async () => {
    setIsGrading(true);

    if (onGradingStart) {
      onGradingStart();
    }

    try {
      await onSubmission();
      setGradingComplete(true);

      if (onGradingComplete) {
        onGradingComplete();
      }

      // Brief delay to show "grading complete" message
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error during submission:', error);
      setIsGrading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  React.useEffect(() => {
    if (isOpen && !screenshotCaptured) {
      setIsCapturingScreenshot(true);
      setScreenshotError(null);

      onPreSubmission()
        .then(() => {
          setScreenshotCaptured(true);
        })
        .catch((error) => {
          setScreenshotError(error instanceof Error ? error.message : 'Failed to capture screenshot');
        })
        .finally(() => {
          setIsCapturingScreenshot(false);
        });
    }
  }, [isOpen, onPreSubmission, screenshotCaptured]);

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <Dialog onClose={handleCancel} onBackdrop={handleCancel}>
        <DialogTitle>
          Submit Challenge
          <DialogClose />
        </DialogTitle>
        <DialogDescription>
          <div className="space-y-4">
            <p>Are you ready to submit your solution for this challenge? This action cannot be undone.</p>

            {isGrading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="i-svg-spinners:90-ring-with-bg text-blue-500" />
                  <span className="text-blue-700 font-medium">Grading your solution...</span>
                </div>
              </div>
            )}

            {gradingComplete && !isGrading && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="i-ph:check-circle text-green-500" />
                  <span className="text-green-700 font-medium">Grading complete!</span>
                </div>
              </div>
            )}
          </div>
        </DialogDescription>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-bolt-elements-borderColor">
          <DialogButton type="secondary" onClick={handleCancel}>
            Cancel
          </DialogButton>
          <DialogButton
            type="primary"
            onClick={handleConfirmSubmission}
            disabled={isCapturingScreenshot || isGrading}
          >
            {isCapturingScreenshot ? 'Capturing Screenshot...' :
             isGrading ? 'Grading...' :
             gradingComplete ? 'Complete!' :
             'Submit Solution'}
          </DialogButton>
        </div>
      </Dialog>
    </DialogRoot>
  );
}