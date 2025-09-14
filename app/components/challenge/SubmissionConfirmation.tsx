import React, { useState } from 'react';
import { Dialog, DialogRoot, DialogTitle, DialogDescription, DialogButton, DialogClose } from '../ui/Dialog';

export interface SubmissionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onPreSubmission: () => Promise<void>;
  onSubmission: () => void;
  challenge: { id: string };
}

export function SubmissionConfirmation({
  isOpen,
  onClose,
  onPreSubmission,
  onSubmission,
  challenge,
}: SubmissionConfirmationProps) {
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [screenshotCaptured, setScreenshotCaptured] = useState(false);

  const handleConfirmSubmission = () => {
    onSubmission();
    onClose();
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

            {isCapturingScreenshot && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="i-svg-spinners:90-ring-with-bg text-blue-500" />
                  <span className="text-blue-700 font-medium">Capturing proctoring screenshot...</span>
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
            disabled={isCapturingScreenshot}
          >
            {isCapturingScreenshot ? 'Capturing Screenshot...' : 'Submit Solution'}
          </DialogButton>
        </div>
      </Dialog>
    </DialogRoot>
  );
}