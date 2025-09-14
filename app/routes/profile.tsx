import { Header } from '~/components/header/Header';
import React, { useState, useEffect } from 'react';
import { WeeklyActivityChart } from '~/components/profile/WeeklyActivityChart';
import { ChallengeCard } from '~/components/challenge/ChallengeCard';

// dummy data for demonstration
const userStats = {
  name: 'Azam Jawad Butt',
  solved: 42,
  easy: 20,
  medium: 15,
  hard: 7,
  easyTotal: 50,
  mediumTotal: 40,
  hardTotal: 20,
};

function getRank(solved: number) {
  if (solved >= 100) {
    return 'Coding Master';
  }

  if (solved >= 50) {
    return 'Vibe Coder';
  }

  if (solved >= 20) {
    return 'Getting Good';
  }

  return 'Beginner';
}

type ProgressBarProps = { value: number; max: number; color: string };

function ProgressBar({ value, max, color }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-32 h-3 bg-bolt-elements-background-depth-1 rounded-full overflow-hidden">
      <div className={color + ' h-full rounded-full transition-all'} style={{ width: percent + '%' }} />
    </div>
  );
}

export default function ProfilePage() {
  const [showStats, setShowStats] = useState(false);

  // Example weekly activity data
  const weeklyActivity = [
    { week: 'Week 1', count: 2 },
    { week: 'Week 2', count: 5 },
    { week: 'Week 3', count: 3 },
    { week: 'Week 4', count: 7 },
    { week: 'Week 5', count: 4 },
    { week: 'Week 6', count: 6 },
    { week: 'Week 7', count: 8 },
  ];

  // Get solved challenge IDs from sessionStorage
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const solved: string[] = [];

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);

        if (key && key.startsWith('solved-') && sessionStorage.getItem(key) === 'true') {
          solved.push(key.replace('solved-', ''));
        }
      }
      setSolvedChallenges(solved);
    }
  }, []);

  // Import challenges list from _index.tsx (copy here for now)
  const challenges = [
    { id: '1', title: 'Sales Dashboard', image: '/sales-dashboard.png', difficulty: 'Hard', averageAccuracy: 62 },
    { id: '2', title: 'Login Box', image: '/login.png', difficulty: 'Medium', averageAccuracy: 91 },
    { id: '3', title: 'Google Drive', image: '/Folders.png', difficulty: 'Medium', averageAccuracy: 87 },
    { id: '4', title: 'Profile Page', image: '/profile.jpg', difficulty: 'Hard', averageAccuracy: 74 },
    { id: '5', title: 'Counter', image: '/counter.gif', difficulty: 'Easy', averageAccuracy: 68 },
    { id: '6', title: 'Weather Forecast', image: '/weather-app.png', difficulty: 'Medium', averageAccuracy: 41 },
  ];
  const solvedChallengeData = challenges.filter((c) => solvedChallenges.includes(c.id));

  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-bolt-elements-background-depth-1">
      <Header />
      <main className="flex-1 w-full pt-10 pb-20 px-4">
        <section className="w-full max-w-4xl mx-auto bg-bolt-elements-background-depth-2 rounded-2xl border border-bolt-elements-borderColor shadow-lg overflow-hidden mb-10">
          {/* Profile header removed */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-16 px-10 pt-12 pb-8 border-b border-bolt-elements-borderColor bg-bolt-elements-background-depth-2">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 via-yellow-400 to-red-400 flex items-center justify-center mb-4 shadow-xl border-4 border-white">
                <span className="text-7xl font-extrabold text-white select-none">JB</span>
              </div>
              <h1 className="text-bolt-elements-textPrimary text-4xl font-extrabold mb-1 tracking-tight">
                {userStats.name}
              </h1>
              <div className="text-bolt-elements-textSecondary text-lg mb-2">
                <span className="font-bold text-bolt-elements-textPrimary">{getRank(userStats.solved)}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">Active</span>
                <span className="text-bolt-elements-textSecondary text-xs">Member since 2024</span>
              </div>
              <div className="text-bolt-elements-textSecondary text-xs">Last solved: 2 days ago</div>
            </div>
            <div className="flex flex-col items-center md:items-end flex-1">
              <div className="flex gap-10 mb-3">
                <div className="flex flex-col items-center">
                  <span className="text-green-500 text-3xl font-extrabold">{userStats.easy}</span>
                  <span className="text-bolt-elements-textSecondary text-sm">Easy</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-yellow-500 text-3xl font-extrabold">{userStats.medium}</span>
                  <span className="text-bolt-elements-textSecondary text-sm">Medium</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-red-500 text-3xl font-extrabold">{userStats.hard}</span>
                  <span className="text-bolt-elements-textSecondary text-sm">Hard</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-bolt-elements-textPrimary text-xl font-bold">Total Solved:</span>
                <span className="text-green-500 text-2xl font-extrabold">{userStats.solved}</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary text-xs px-2 py-1 rounded">
                  Streak: 5 days
                </span>
                <span className="bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary text-xs px-2 py-1 rounded">
                  Accuracy: 92%
                </span>
              </div>
            </div>
          </div>
          {/* Weekly Activity Chart + Statistics side by side */}
          <div
            className="flex flex-col md:flex-row gap-8 px-0 py-0 bg-bolt-elements-background-depth-1 items-center justify-center md:items-center md:justify-center min-h-[340px]"
            style={{ boxShadow: 'none', border: 'none' }}
          >
            <div className="w-full md:w-1/2 px-10 py-8 flex items-center justify-center">
              <WeeklyActivityChart data={weeklyActivity} small />
            </div>
            <div className="w-full md:w-1/2 px-10 py-8 flex flex-col justify-center">
              <h2 className="text-xl font-bold text-bolt-elements-textPrimary mb-4 text-left">Statistics</h2>
              <div className="overflow-x-auto w-full">
                <table className="min-w-full text-lg text-left border-collapse">
                  <thead>
                    <tr className="bg-bolt-elements-background-depth-2">
                      <th className="px-4 py-2 font-semibold text-white text-lg text-left">Category</th>
                      <th className="px-4 py-2 font-semibold text-white text-lg text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 text-white text-base">Average Acceptance Rate</td>
                      <td className="px-4 py-2 text-white text-base">92%</td>
                    </tr>
                    <tr className="bg-bolt-elements-background-depth-2/50">
                      <td className="px-4 py-2 text-white text-base">Longest Streak</td>
                      <td className="px-4 py-2 text-white text-base">12 days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-white text-base">Last Submission</td>
                      <td className="px-4 py-2 text-white text-base">2 days ago</td>
                    </tr>
                    <tr className="bg-bolt-elements-background-depth-2/50">
                      <td className="px-4 py-2 text-white text-base">Total Submissions</td>
                      <td className="px-4 py-2 text-white text-base">128</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Progress section */}
          <div className="px-10 py-10 bg-bolt-elements-background-depth-1 flex flex-col items-center justify-center">
            {/* Solved Challenges Section */}
            <h2 className="text-2xl font-bold text-white mb-4">Solved Challenges</h2>
            {solvedChallengeData.length === 0 ? (
              <div className="text-white/70">No challenges solved yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl mx-auto">
                {solvedChallengeData.map((challenge) => (
                  <ChallengeCard key={challenge.id} {...challenge} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
