import React, { useState } from 'react';
import { Dialog, DialogRoot, DialogTitle, DialogDescription, DialogButton, DialogClose } from '../ui/Dialog';

export interface ScreenSharePrompterProps {
  isOpen: boolean;
  onClose: () => void;
  onScreenShareStart: () => Promise<{ success: boolean; error?: string }>;
  onSuccess: () => void;
  challengeTitle: string;
}

export function ScreenSharePrompter({
  isOpen,
  onClose,
  onScreenShareStart,
  onSuccess,
  challengeTitle,
}: ScreenSharePrompterProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartScreenShare = async () => {
    setIsStarting(true);
    setError(null);

    try {
      const result = await onScreenShareStart();

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Failed to start screen sharing');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error occurred');
    } finally {
      setIsStarting(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };


  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <Dialog onClose={handleCancel} onBackdrop={handleCancel}>
        <DialogTitle>
          Enable AI Proctoring
          <DialogClose />
        </DialogTitle>
        <DialogDescription>
          <div className="space-y-4">
            <p>
              Screen sharing is required for integrity purposes.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-1">Error:</h4>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>
        </DialogDescription>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-bolt-elements-borderColor">
          <DialogButton type="secondary" onClick={handleCancel} disabled={isStarting}>
            Cancel
          </DialogButton>
          <DialogButton
            type="primary"
            onClick={handleStartScreenShare}
            disabled={isStarting}
          >
            {isStarting ? (
              <>
                <div className="i-svg-spinners:90-ring-with-bg mr-2" />
                Starting...
              </>
            ) : (
              'Enable Screen Sharing'
            )}
          </DialogButton>
        </div>
      </Dialog>
    </DialogRoot>
  );
}