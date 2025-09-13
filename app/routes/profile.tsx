import { Header } from '~/components/header/Header';
import { useState } from 'react';

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

  return (
    <div className="flex flex-col min-h-screen bg-bolt-elements-background-depth-1">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <section className="w-full max-w-4xl mx-auto bg-bolt-elements-background-depth-2 rounded-2xl border border-bolt-elements-borderColor shadow-lg overflow-hidden">
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
          {/* Progress section */}
          <div className="px-10 py-10 bg-bolt-elements-background-depth-1 flex flex-col items-center justify-center">
            {/* Add more detail: stats table */}
            <div className="mt-10 w-full flex flex-col items-center">
              <button
                className="text-lg text-white bg-bolt-elements-background-depth-2 px-6 py-3 rounded font-bold mb-4 flex items-center gap-2 hover:bg-bolt-elements-background-depth-1 transition shadow-lg"
                onClick={() => setShowStats((s) => !s)}
                aria-expanded={showStats}
              >
                <span className="text-xl">Statistics</span>
                <svg
                  className={`w-5 h-5 transition-transform ${showStats ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showStats && (
                <div className="overflow-x-auto w-full max-w-md mx-auto">
                  <table className="min-w-full text-lg text-left border-collapse">
                    <thead>
                      <tr className="bg-bolt-elements-background-depth-2">
                        <th className="px-4 py-2 font-semibold text-white text-lg">Category</th>
                        <th className="px-4 py-2 font-semibold text-white text-lg">Value</th>
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
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
