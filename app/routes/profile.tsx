import { Header } from '~/components/header/Header';
import { useState, useEffect } from 'react';
import { WeeklyActivityChart } from '~/components/profile/WeeklyActivityChart';

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

type Challenge = {
  id: string;
  title: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  averageAccuracy: number;
};

export default function ProfilePage() {
  // example weekly activity data
  const weeklyActivity = [
    { week: 'Mon', count: 2 },
    { week: 'Tue', count: 5 },
    { week: 'Wed', count: 3 },
    { week: 'Thu', count: 7 },
    { week: 'Fri', count: 4 },
    { week: 'Sat', count: 6 },
    { week: 'Sun', count: 8 },
  ];

  // get solved challenge IDs from localStorage
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const solved: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key && key.startsWith('challenge-solved-') && localStorage.getItem(key) === '1') {
          solved.push(key.replace('challenge-solved-', ''));
        }
      }
      setSolvedChallenges(solved);

      // dynamically import challenges.json to avoid static import issues
      import('../../data/challenges.json').then((mod) => {
        const data = (mod.default as any[]).map((c) => ({
          ...c,
          difficulty: (c.difficulty.charAt(0).toUpperCase() + c.difficulty.slice(1).toLowerCase()) as
            | 'Easy'
            | 'Medium'
            | 'Hard',
        }));
        setChallenges(data);
      });
    }
  }, []);

  const solvedChallengeData: Challenge[] = challenges.filter((c: Challenge) => solvedChallenges.includes(c.id));

  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-bolt-elements-background-depth-1">
      <Header />
      <main className="flex-1 w-full pt-10 pb-20 px-4">
        <section className="w-full max-w-4xl mx-auto bg-bolt-elements-background-depth-2 rounded-2xl border border-bolt-elements-borderColor shadow-lg overflow-hidden mb-10">
          {/* Profile header removed */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-16 px-10 pt-12 pb-8 border-b border-bolt-elements-borderColor bg-bolt-elements-background-depth-2">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-green-400 via-yellow-400 to-red-400 flex items-center justify-center mb-4 shadow-xl border-2 border-black overflow-hidden">
                <img src="/headshot.JPG" alt="Profile headshot" className="w-full h-full object-cover rounded-full" />
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
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="w-full max-w-xs md:max-w-sm h-[320px] flex items-center justify-center">
                <WeeklyActivityChart data={weeklyActivity} />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
              <div className="w-full max-w-xs md:max-w-sm h-[245px] flex flex-col justify-center bg-transparent rounded-xl p-4 shadow-md border border-bolt-elements-borderColor -mt-6">
                <h2 className="text-lg font-bold text-bolt-elements-textPrimary mb-2 text-left">Statistics</h2>
                <div className="overflow-x-auto w-full">
                  <table className="min-w-full text-base text-left border-collapse">
                    <thead>
                      <tr className="bg-bolt-elements-background-depth-2">
                        <th className="px-3 py-1 font-semibold text-white text-base text-left">Category</th>
                        <th className="px-3 py-1 font-semibold text-white text-base text-left">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-1 text-white text-sm">Average Acceptance Rate</td>
                        <td className="px-3 py-1 text-white text-sm">92%</td>
                      </tr>
                      <tr className="bg-bolt-elements-background-depth-2/50">
                        <td className="px-3 py-1 text-white text-sm">Longest Streak</td>
                        <td className="px-3 py-1 text-white text-sm">12 days</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1 text-white text-sm">Last Submission</td>
                        <td className="px-3 py-1 text-white text-sm">2 days ago</td>
                      </tr>
                      <tr className="bg-bolt-elements-background-depth-2/50">
                        <td className="px-3 py-1 text-white text-sm">Total Submissions</td>
                        <td className="px-3 py-1 text-white text-sm">128</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* Solved Challenges List */}
          <div className="w-full max-w-2xl mx-auto mt-8 mb-8 bg-bolt-elements-background-depth-1 rounded-xl border border-bolt-elements-borderColor shadow p-6">
            <CollapsibleSolvedChallenges solvedChallengeData={solvedChallengeData} />
          </div>
        </section>
      </main>
    </div>
  );
}

function CollapsibleSolvedChallenges({ solvedChallengeData }: { solvedChallengeData: Challenge[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      <button
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor text-bolt-elements-textPrimary text-lg font-bold shadow focus:outline-none focus:ring-2 focus:ring-bolt-elements-accent/60 transition mb-2"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="solved-challenges-list"
      >
        <span className="flex items-center gap-2">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="inline-block text-green-400">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path
              d="M7 13l3 3 7-7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Solved Challenges
        </span>
        <svg
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div id="solved-challenges-list" className="flex flex-col gap-5 mt-2">
          {solvedChallengeData.length === 0 ? (
            <div className="text-bolt-elements-textSecondary text-lg">You haven't solved any challenges yet.</div>
          ) : (
            solvedChallengeData.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-5 bg-bolt-elements-background-depth-2 rounded-xl p-4 shadow border border-bolt-elements-borderColor hover:shadow-lg transition group"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-green-300 bg-white flex items-center justify-center shadow-md">
                  <img src={c.image} alt={c.title} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="font-bold text-bolt-elements-textPrimary text-lg mb-1 truncate" title={c.title}>
                    {c.title}
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        c.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-700'
                          : c.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {c.difficulty}
                    </span>
                    <span className="text-xs text-bolt-elements-textSecondary bg-bolt-elements-background-depth-1 px-2 py-1 rounded-full">
                      Accuracy: {c.averageAccuracy}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
