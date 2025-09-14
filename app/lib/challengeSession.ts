import { type Challenge } from './challenges';

interface ChallengeSession {
  challengeId: string;
  challenge: Challenge;
  timestamp: number;
  proctoring?: {
    isActive: boolean;
    screenshotTaken: boolean;
    startTime?: number;
    endTime?: number;
  };
}

const CHALLENGE_SESSION_KEY = 'bolt-challenge-context';

export function setChallengeContext(challengeId: string, challenge: Challenge, proctoring?: { isActive: boolean }): void {
  try {
    const sessionData: ChallengeSession = {
      challengeId,
      challenge,
      timestamp: Date.now(),
      proctoring: proctoring ? {
        isActive: proctoring.isActive,
        screenshotTaken: false,
        startTime: proctoring.isActive ? Date.now() : undefined,
      } : undefined,
    };

    sessionStorage.setItem(CHALLENGE_SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.warn('Failed to store challenge context in session storage:', error);
  }
}

export function getChallengeContext(): ChallengeSession | null {
  try {
    const stored = sessionStorage.getItem(CHALLENGE_SESSION_KEY);
    if (!stored) {
      return null;
    }

    const sessionData: ChallengeSession = JSON.parse(stored);

    // Check if the session is not too old (1 hour max)
    const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
    if (Date.now() - sessionData.timestamp > maxAge) {
      clearChallengeContext();
      return null;
    }

    return sessionData;
  } catch (error) {
    console.warn('Failed to retrieve challenge context from session storage:', error);
    clearChallengeContext();
    return null;
  }
}

export function clearChallengeContext(): void {
  try {
    sessionStorage.removeItem(CHALLENGE_SESSION_KEY);
  } catch (error) {
    console.warn('Failed to clear challenge context from session storage:', error);
  }
}

export function hasChallengeContext(): boolean {
  return getChallengeContext() !== null;
}

export function updateProctoringStatus(screenshotTaken: boolean): void {
  try {
    const currentSession = getChallengeContext();
    if (!currentSession) return;

    const updatedSession: ChallengeSession = {
      ...currentSession,
      proctoring: currentSession.proctoring ? {
        ...currentSession.proctoring,
        screenshotTaken,
        endTime: screenshotTaken ? Date.now() : currentSession.proctoring.endTime,
      } : undefined,
    };

    sessionStorage.setItem(CHALLENGE_SESSION_KEY, JSON.stringify(updatedSession));
  } catch (error) {
    console.warn('Failed to update proctoring status in session storage:', error);
  }
}

export function clearProctoringSession(): void {
  try {
    const currentSession = getChallengeContext();
    if (!currentSession || !currentSession.proctoring) return;

    const clearedSession: ChallengeSession = {
      ...currentSession,
      proctoring: {
        ...currentSession.proctoring,
        isActive: false,
        endTime: Date.now(),
      },
    };

    sessionStorage.setItem(CHALLENGE_SESSION_KEY, JSON.stringify(clearedSession));
  } catch (error) {
    console.warn('Failed to clear proctoring session in session storage:', error);
  }
}