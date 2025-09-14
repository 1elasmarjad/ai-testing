export interface Challenge {
  id: string;
  title: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  averageAccuracy: number;
}

let challengesCache: Challenge[] | null = null;

async function loadChallenges(): Promise<Challenge[]> {
  if (challengesCache) {
    return challengesCache;
  }

  try {
    // in production, we'll need to handle file loading differently for Cloudflare Workers
    const challengesModule = await import('../../data/challenges.json');
    challengesCache = challengesModule.default as Challenge[];

    return challengesCache;
  } catch (error) {
    console.error('Failed to load challenges:', error);
    return [];
  }
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  const challenges = await loadChallenges();
  return challenges.find((challenge) => challenge.id === id) || null;
}

export async function getAllChallenges(): Promise<Challenge[]> {
  return loadChallenges();
}
