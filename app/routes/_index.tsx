import { type MetaFunction, type LoaderFunction } from '@remix-run/cloudflare';
import { Header } from '~/components/header/Header';
import { useState } from 'react';
import { ChallengeCard } from '~/components/challenge/ChallengeCard';
import { useNavigate, useLoaderData } from '@remix-run/react';
import { getAllChallenges, type Challenge } from '~/lib/challenges';

export const meta: MetaFunction = () => {
  return [{ title: 'Promptly' }, { name: 'description', content: 'Test your vibe coding skills' }];
};

export const loader: LoaderFunction = async () => {
  const challenges = await getAllChallenges();
  return { challenges };
};

export default function Index() {
  const navigate = useNavigate();
  const { challenges } = useLoaderData<{ challenges: Challenge[] }>();
  const [difficulty, setDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [sort, setSort] = useState<'title' | 'difficulty'>('title');
  const [search, setSearch] = useState('');

  const filtered = challenges.filter(
    (c) =>
      (difficulty === 'All' || c.difficulty === difficulty) && c.title.toLowerCase().includes(search.toLowerCase()),
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'title') {
      return a.title.localeCompare(b.title);
    }

    if (sort === 'difficulty') {
      return a.difficulty.localeCompare(b.difficulty);
    }

    return 0;
  });

  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <div className="min-h-screen bg-bolt-elements-background-depth-1 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Solve Challenges header */}
          <div
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-4 gap-4 w-full bg-bolt-elements-background-depth-2 rounded-lg shadow-lg border-0 p-6 md:p-8 transition-all duration-200 relative"
            style={{
              minHeight: '110px',
              width: '100%',
              position: 'relative',
              marginLeft: 0,
              marginRight: 0,
              left: 'unset',
              right: 'unset',
              paddingBottom: '0.5rem',
            }}
          >
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-2 leading-tight text-center md:text-left">
                Solve Challenges
              </h1>
              <p className="text-lg text-white/80 font-medium mt-0 drop-shadow-sm text-center md:text-left pb-6">
                Browse and solve interactive UI challenges to sharpen your vibe coding skills.
              </p>
            </div>
            <img
              src="/logoooo-removebg-preview.png"
              alt="Logo"
              className="h-20 w-auto object-contain absolute right-8 top-1/2 -translate-y-1/2 hidden md:block"
            />
          </div>
          {/* End of Solve Challenges header */}
          {/* Just a big search bar */}
          <div className="mt-20 mb-8 bg-bolt-elements-background-depth-2 rounded-xl border border-bolt-elements-borderColor shadow-lg p-6 w-full max-w-4xl mx-auto transition-all duration-200">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 i-ph:magnifying-glass text-xl text-bolt-elements-textSecondary pointer-events-none" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg pl-14 pr-6 py-2 border-0 bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-accent/60 transition shadow-md text-lg font-medium placeholder:text-bolt-elements-textSecondary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-16">
            {sorted.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                {...challenge}
                onClick={() =>
                  navigate(`/challenge/${challenge.id}`, {
                    state: { image: challenge.image, title: challenge.title, difficulty: challenge.difficulty },
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
