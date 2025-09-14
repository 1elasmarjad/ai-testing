interface PromptScoreSession {
  challengeId: string;
  scores: number[];
  timestamp: number;
}

const PROMPT_SCORES_KEY_PREFIX = 'prompt-scores';

export class PromptScoringService {
  private getStorageKey(challengeId: string): string {
    return `${PROMPT_SCORES_KEY_PREFIX}-${challengeId}`;
  }

  private getSession(challengeId: string): PromptScoreSession | null {
    try {
      const stored = sessionStorage.getItem(this.getStorageKey(challengeId));
      if (!stored) {
        return null;
      }

      const session: PromptScoreSession = JSON.parse(stored);

      // Check if session is not too old (1 hour max)
      const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
      if (Date.now() - session.timestamp > maxAge) {
        this.clearScores(challengeId);
        return null;
      }

      return session;
    } catch (error) {
      console.warn('Failed to retrieve prompt scores from session storage:', error);
      this.clearScores(challengeId);
      return null;
    }
  }

  private saveSession(session: PromptScoreSession): void {
    try {
      sessionStorage.setItem(
        this.getStorageKey(session.challengeId),
        JSON.stringify(session)
      );
    } catch (error) {
      console.warn('Failed to store prompt scores in session storage:', error);
    }
  }

  /**
   * Add a prompt score to the current challenge session
   */
  addPromptScore(challengeId: string, score: number): void {
    if (score < 1 || score > 5) {
      console.warn('Invalid prompt score:', score);
      return;
    }

    let session = this.getSession(challengeId);

    if (!session) {
      // Create new session
      session = {
        challengeId,
        scores: [],
        timestamp: Date.now(),
      };
    }

    session.scores.push(score);
    session.timestamp = Date.now(); // Update timestamp

    this.saveSession(session);
  }

  /**
   * Get the average prompt score for a challenge (rounded to 1 decimal place)
   */
  getAveragePromptScore(challengeId: string): number {
    const session = this.getSession(challengeId);

    if (!session || session.scores.length === 0) {
      return 3.0; // Default score if no prompts sent
    }

    const sum = session.scores.reduce((acc, score) => acc + score, 0);
    const average = sum / session.scores.length;

    // Round up to 1 decimal place
    return Math.ceil(average * 10) / 10;
  }

  /**
   * Get all stored prompt scores for a challenge
   */
  getPromptScores(challengeId: string): number[] {
    const session = this.getSession(challengeId);
    return session ? session.scores : [];
  }

  /**
   * Get the total number of prompts scored for a challenge
   */
  getPromptCount(challengeId: string): number {
    const session = this.getSession(challengeId);
    return session ? session.scores.length : 0;
  }

  /**
   * Clear all prompt scores for a challenge
   */
  clearScores(challengeId: string): void {
    try {
      sessionStorage.removeItem(this.getStorageKey(challengeId));
    } catch (error) {
      console.warn('Failed to clear prompt scores from session storage:', error);
    }
  }

  /**
   * Clear all expired prompt score sessions
   */
  clearExpiredSessions(): void {
    try {
      const keysToRemove: string[] = [];
      const maxAge = 60 * 60 * 1000; // 1 hour

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(PROMPT_SCORES_KEY_PREFIX)) {
          try {
            const stored = sessionStorage.getItem(key);
            if (stored) {
              const session: PromptScoreSession = JSON.parse(stored);
              if (Date.now() - session.timestamp > maxAge) {
                keysToRemove.push(key);
              }
            }
          } catch (error) {
            // Invalid JSON, mark for removal
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear expired prompt score sessions:', error);
    }
  }
}

// Export singleton instance
export const promptScoringService = new PromptScoringService();

// Clean up expired sessions on import
promptScoringService.clearExpiredSessions();