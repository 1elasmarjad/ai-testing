import React, { useState, useEffect } from 'react';

export type ChallengeCardProps = {
  id: string;
  title: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  averageAccuracy?: number; // percentage, optional for backward compatibility
  onClick?: () => void;
};

export function ChallengeCard({ id, title, image, difficulty, averageAccuracy, onClick }: ChallengeCardProps) {
  const difficultyColor =
    difficulty === 'Easy' ? 'text-green-500' : difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500';

  // Check solved state from sessionStorage
  const [solved, setSolved] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSolved(sessionStorage.getItem(`solved-${id}`) === 'true');
    }
  }, [id]);

  // Optionally, you could provide a prop to set solved from parent if needed

  return (
    <div
      className="cursor-pointer bg-bolt-elements-background-depth-2 rounded-lg shadow border border-bolt-elements-borderColor hover:shadow-lg transition flex flex-col overflow-hidden group w-full max-w-xs mx-auto relative"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Open challenge ${title}`}
      style={{ minHeight: 220 }}
    >
      {/* Solved overlay */}
      {solved && (
        <div className="absolute top-3 right-3 z-10 bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Solved
        </div>
      )}
      <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-bolt-elements-textPrimary truncate" title={title}>
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {/* Removed averageAccuracy percent display */}
            <span className={`text-xs font-semibold ${difficultyColor}`}>{difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
