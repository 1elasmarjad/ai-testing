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

  // Check solved state from localStorage
  const [solved, setSolved] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setSolved(localStorage.getItem(`solved-${id}`) === 'true');
    }
  }, [id]);

  return (
    <div
      className="cursor-pointer bg-bolt-elements-background-depth-2 rounded-lg shadow border border-bolt-elements-borderColor hover:shadow-lg transition flex flex-col overflow-hidden group w-full max-w-xs mx-auto relative"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Open challenge ${title}`}
      style={{ minHeight: 220 }}
    >
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
            {typeof averageAccuracy === 'number' && (
              <span className="text-xs font-semibold text-blue-500 flex items-center">
                {averageAccuracy}%
                <span className="mx-2 h-4 border-l border-bolt-elements-borderColor" />
              </span>
            )}
            <span className={`text-xs font-semibold ${difficultyColor}`}>{difficulty}</span>
          </div>
        </div>
      </div>
      {/* Remove solved overlay/label if solved */}
      {/* If you want to show an overlay for unsolved, you can add it here */}
    </div>
  );
}
