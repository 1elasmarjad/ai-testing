import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import React, { useState } from 'react';
import { ChallengeCard } from '~/components/challenge/ChallengeCard';
import { useNavigate } from '@remix-run/react';

type Challenge = {
  id: string;
  title: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  averageAccuracy: number;
  description?: string;
};

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Sales Dashboard',
    image: '/sales-dashboard.png',
    difficulty: 'Hard',
    averageAccuracy: 62,
  },
  {
    id: '2',
    title: 'Login Box',
    image: '/login.png',
    difficulty: 'Medium',
    averageAccuracy: 91,
  },
  {
    id: '3',
    title: 'Google Drive',
    image: '/Folders.png',
    difficulty: 'Medium',
    averageAccuracy: 87,
  },
  {
    id: '4',
    title: 'Profile Page',
    image: '/profile.jpg',
    difficulty: 'Hard',
    averageAccuracy: 74,
    description: 'Determine whether an integer is a palindrome.',
  },
  {
    id: '5',
    title: 'Counter',
    image: '/counter.gif',
    difficulty: 'Easy',
    averageAccuracy: 68,
  },
  {
    id: '6',
    title: 'Weather Forecast',
    image: '/weather-app.png',
    difficulty: 'Medium',
    averageAccuracy: 41,
    description: 'Place N queens on an N×N chessboard so that no two queens threaten each other.',
  },
] as const;

export const meta: MetaFunction = () => {
  return [{ title: 'Bolt' }, { name: 'description', content: 'Talk with Bolt, an AI assistant from StackBlitz' }];
};

export const loader = () => json({});

export default function Index() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = challenges.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="min-h-screen w-full bg-bolt-elements-background-depth-1 flex flex-col">
      <Header />
      <main className="flex-1 w-full py-10 px-4 pb-16">
        <div className="w-full max-w-6xl mx-auto">
          <div className="w-full px-0 md:px-0">
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
                paddingBottom: '0.5rem', // further reduce bottom padding
              }}
            >
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-2 leading-tight text-center md:text-left">
                  Solve Challenges
                </h1>
                <p className="text-lg text-white/80 font-medium mt-0 drop-shadow-sm text-center md:text-left pb-6">
                  Browse and solve interactive UI challenges to sharpen your frontend skills.
                </p>
              </div>
              <img
                src="/logoooo-removebg-preview.png"
                alt="Logo"
                className="h-20 w-auto object-contain absolute right-8 top-1/2 -translate-y-1/2 hidden md:block"
              />
            </div>
          </div>
          <div className="mb-8 bg-bolt-elements-background-depth-2 rounded-xl border border-bolt-elements-borderColor shadow-lg p-6 w-full max-w-4xl mx-auto transition-all duration-200 mt-20">
            <input
              type="text"
              placeholder="Search challenges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg px-6 py-4 border-0 bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-accent/60 transition shadow-md text-xl font-medium placeholder:text-bolt-elements-textSecondary"
            />
          </div>
          <div className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {filtered.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                {...challenge}
                onClick={() =>
                  navigate('/challenge/counter', {
                    state: {
                      id: challenge.id,
                      image: challenge.image,
                      title: challenge.title,
                      difficulty: challenge.difficulty,
                    },
                    replace: true,
                  })
                }
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
