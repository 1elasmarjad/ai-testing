import { type MetaFunction, type LoaderFunction } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { Header } from '~/components/header/Header';

export const meta: MetaFunction = () => {
  return [{ title: 'Challenge Results - Promptly' }, { name: 'description', content: 'View your challenge results' }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const promptScore = url.searchParams.get('prompt_score') || '0';
  const qualityScore = url.searchParams.get('quality_score') || '0';
  const speedScore = url.searchParams.get('speed_score') || '0';

  return { promptScore, qualityScore, speedScore };
};

interface PerformanceScaleProps {
  level: number; // 1-5
  title: string;
  className?: string;
}

function PerformanceScale({ level, title, className = '' }: PerformanceScaleProps) {
  const scaleLabels = ['Very Poor', 'Poor', 'Acceptable', 'Good', 'Very Good'];
  const scaleColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const inactiveColors = ['bg-red-500/20', 'bg-orange-500/20', 'bg-yellow-500/20', 'bg-lime-500/20', 'bg-green-500/20'];

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-bolt-elements-textPrimary mb-3 text-center">{title}</h3>
      <div className="flex items-center">
        {scaleLabels.map((label, index) => {
          const isActive = index + 1 === level;
          const colorClass = isActive ? scaleColors[index] : inactiveColors[index];
          const textColorClass = isActive ? 'text-white' : 'text-bolt-elements-textSecondary';
          const borderClass = isActive ? `border-2 ${scaleColors[index].replace('bg-', 'border-')}` : 'border border-bolt-elements-borderColor';

          // Determine rounded corners - only first and last segments have curves
          const roundedClass = index === 0
            ? 'rounded-l-lg'
            : index === scaleLabels.length - 1
              ? 'rounded-r-lg'
              : '';

          return (
            <div
              key={index}
              className={`flex-1 px-2 py-3 text-center text-sm font-semibold transition-all duration-200 ${colorClass} ${textColorClass} ${borderClass} ${roundedClass}`}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ResultPage() {
  const { promptScore, qualityScore, speedScore } = useLoaderData<{
    promptScore: string;
    qualityScore: string;
    speedScore: string;
  }>();

  // Convert strings to numbers
  const prompt = parseInt(promptScore) || 0;
  const quality = parseInt(qualityScore) || 0;
  const speed = parseInt(speedScore) || 0;

  // Normalize scores to 0-1 range
  const normalizedPrompt = Math.min(prompt / 5, 1);
  const normalizedQuality = Math.min(quality / 100, 1);
  const normalizedSpeed = Math.min(speed / 5, 1);

  // Calculate overall average and convert to 1-5 scale
  const overallAverage = (normalizedPrompt + normalizedQuality + normalizedSpeed) / 3;
  const overallLevel = Math.max(1, Math.round(overallAverage * 5));

  // Convert individual scores to 1-5 scale for individual displays
  const promptLevel = Math.max(1, Math.round(normalizedPrompt * 5));
  const qualityLevel = Math.max(1, Math.round(normalizedQuality * 5));
  const speedLevel = Math.max(1, Math.round(normalizedSpeed * 5));

  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-bolt-elements-background-depth-1">
      <Header />
      <main className="flex-1 w-full pt-10 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-bolt-elements-background-depth-2 rounded-2xl border border-bolt-elements-borderColor shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-extrabold text-bolt-elements-textPrimary mb-8 text-center">
              Challenge Results
            </h1>

            {/* Overall Performance Scale */}
            <div className="mb-8 bg-bolt-elements-background-depth-1 rounded-xl border border-bolt-elements-borderColor p-6">
              <PerformanceScale
                level={overallLevel}
                title="Overall Performance"
                className="mb-2"
              />
            </div>

            {/* Individual Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-bolt-elements-background-depth-1 rounded-xl border border-bolt-elements-borderColor p-6 text-center">
                <h2 className="text-lg font-semibold text-bolt-elements-textSecondary mb-2">Prompt Score</h2>
                <div className="text-3xl font-bold text-blue-500 mb-4">{promptScore}/5</div>
              </div>

              <div className="bg-bolt-elements-background-depth-1 rounded-xl border border-bolt-elements-borderColor p-6 text-center">
                <h2 className="text-lg font-semibold text-bolt-elements-textSecondary mb-2">Quality Score</h2>
                <div className="text-3xl font-bold text-green-500 mb-4">{qualityScore}%</div>
              </div>

              <div className="bg-bolt-elements-background-depth-1 rounded-xl border border-bolt-elements-borderColor p-6 text-center">
                <h2 className="text-lg font-semibold text-bolt-elements-textSecondary mb-2">Speed Score</h2>
                <div className="text-3xl font-bold text-yellow-500 mb-4">{speedScore}/5</div>
              </div>
            </div>

            {/* Go to Home Link */}
            <div className="text-center">
              <Link
                to="/"
                className="inline-block bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-bolt-elements-accent/60 transform hover:scale-105"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}