import PageLayout from '~/components/header/PageLayout';

export default function ChallengesPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Challenges</h1>
        <p className="text-lg text-[#a1a1aa]">Browse and solve coding challenges here.</p>
      </div>
    </PageLayout>
  );
}
