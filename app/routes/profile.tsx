import PageLayout from '~/components/header/PageLayout';
import React, { useState } from 'react';

export default function ProfilePage() {
  // example challenge counts
  const easy = 18;
  const medium = 15;
  const hard = 9;
  const solvedCount = easy + medium + hard;

  // rank logic
  let rank = 'Beginner';

  if (solvedCount >= 50) {
    rank = 'Master';
  } else if (solvedCount >= 30) {
    rank = 'Vibe Code God';
  } else if (solvedCount >= 20) {
    rank = 'Pro';
  } else if (solvedCount >= 10) {
    rank = 'Intermediate';
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const submissions = [
    { id: 1, title: 'Two Sum', status: 'Accepted', date: '2025-09-01' },
    { id: 2, title: 'Reverse Linked List', status: 'Accepted', date: '2025-09-05' },
    { id: 3, title: 'Valid Parentheses', status: 'Wrong Answer', date: '2025-09-10' },
  ];

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-3rem)] w-full flex items-center justify-center bg-[#23263a]">
        <div className="flex flex-col items-center w-full h-full p-0 m-0">
          <div className="flex flex-col items-center mb-6 mt-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-4xl font-bold text-white mb-2">
              <span>U</span>
            </div>
            <h2 className="text-2xl font-semibold text-bolt-elements-textPrimary">Username</h2>
            <p className="text-[#a1a1aa] text-lg font-semibold">Rank: {rank}</p>
          </div>
          <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <div className="flex flex-col gap-2 mb-4 w-full">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-[#22c55e]">Easy</span>
                <span className="text-lg font-bold text-bolt-elements-textPrimary">{easy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-[#eab308]">Medium</span>
                <span className="text-lg font-bold text-bolt-elements-textPrimary">{medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-[#ef4444]">Hard</span>
                <span className="text-lg font-bold text-bolt-elements-textPrimary">{hard}</span>
              </div>
            </div>
            <div className="w-full h-2 bg-[#181a20] rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#7c3aed]" style={{ width: `${Math.min(solvedCount, 100)}%` }} />
            </div>
            <div className="relative w-full flex flex-col items-center">
              <button
                className="mt-2 px-4 py-2 bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text rounded hover:bg-bolt-elements-button-primary-backgroundHover transition-colors duration-150"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                View Submissions
              </button>
              {dropdownOpen && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 bg-[#23263a] border border-[#7c3aed] rounded shadow-lg z-10 mt-2">
                  <ul className="divide-y divide-[#2d3142]">
                    {submissions.map((sub) => (
                      <li key={sub.id} className="p-3 flex flex-col text-left">
                        <span className="font-semibold text-bolt-elements-textPrimary">{sub.title}</span>
                        <span className={`text-xs ${sub.status === 'Accepted' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                          {sub.status}
                        </span>
                        <span className="text-xs text-[#a1a1aa]">{sub.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
