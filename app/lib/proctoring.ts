export interface ProctoringState {
  isActive: boolean;
  stream: MediaStream | null;
  error: string | null;
}

class ProctoringService {
  private stream: MediaStream | null = null;
  private isActive: boolean = false;
  private storedScreenshot: Blob | null = null;

  async startScreenShare(): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if browser supports screen sharing
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        return { success: false, error: 'Screen sharing not supported in this browser' };
      }

      // Request screen sharing permission
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      this.isActive = true;

      // Handle user stopping sharing via browser controls
      this.stream.getVideoTracks()[0].addEventListener('ended', () => {
        this.stopScreenShare();
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start screen sharing';
      return { success: false, error: errorMessage };
    }
  }

  async takeScreenshot(challengeId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.stream || !this.isActive) {
      return { success: false, error: 'Screen sharing not active' };
    }

    try {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return { success: false, error: 'Failed to create canvas context' };
      }

      return new Promise((resolve) => {
        video.srcObject = this.stream;
        video.play();

        video.addEventListener('loadedmetadata', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          ctx.drawImage(video, 0, 0);

          canvas.toBlob((blob) => {
            if (!blob) {
              resolve({ success: false, error: 'Failed to create screenshot blob' });
              return;
            }

            // Store the screenshot instead of downloading immediately
            this.storedScreenshot = blob;
            resolve({ success: true });
          }, 'image/png');
        });
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to take screenshot';
      return { success: false, error: errorMessage };
    }
  }

  downloadStoredScreenshot(challengeId: string): { success: boolean; error?: string } {
    if (!this.storedScreenshot) {
      return { success: false, error: 'No screenshot stored' };
    }

    try {
      const timestamp = Date.now();
      const filename = `proctoring-screenshot-${challengeId}-${timestamp}.png`;

      const url = URL.createObjectURL(this.storedScreenshot);
      const link = document.createElement('a');

      link.href = url;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to download screenshot';
      return { success: false, error: errorMessage };
    }
  }

  stopScreenShare(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isActive = false;
    this.storedScreenshot = null; // Clear stored screenshot
  }

  getState(): ProctoringState {
    return {
      isActive: this.isActive,
      stream: this.stream,
      error: null
    };
  }

  isScreenSharingActive(): boolean {
    return this.isActive && this.stream !== null;
  }

  hasStoredScreenshot(): boolean {
    return this.storedScreenshot !== null;
  }

  getStoredScreenshotAsBlob(): Blob | null {
    return this.storedScreenshot;
  }
}

// Export singleton instance
export const proctoringService = new ProctoringService();