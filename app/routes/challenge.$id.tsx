import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { ChallengeChat as ChallengeChatFallback } from '~/components/chat/ChallengeChat';
import { ChallengeChatClient } from '~/components/chat/ChallengeChat.client';
import { getChallengeById, type Challenge } from '~/lib/challenges';
import { ChallengeNavbar } from '~/components/challenge/ChallengeNavbar';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.challenge ? `${data.challenge.title} - Challenge` : 'Challenge Not Found';
  return [{ title }, { name: 'description', content: 'Code challenges powered by AI' }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) {
    throw new Response('Challenge ID is required', { status: 400 });
  }

  const challenge = await getChallengeById(id);

  if (!challenge) {
    throw new Response('Challenge not found', { status: 404 });
  }

  return { challenge };
}

export default function Challenge() {
  const { challenge } = useLoaderData<typeof loader>();

  // timer duration based on difficulty
  const duration = challenge.difficulty === 'Easy' ? 10 * 60 : challenge.difficulty === 'Medium' ? 15 * 60 : 20 * 60;

  return (
    <div className="w-full min-h-screen bg-bolt-elements-background-depth-1 flex flex-col">
      <ChallengeNavbar
        challenge={challenge}
        timerProps={{ start: true, duration }}
        onSubmit={() => {
          if (challenge?.id) {
            localStorage.setItem(`challenge-solved-${challenge.id}`, '1');
            window.dispatchEvent(new CustomEvent('challenge:submit', { detail: { id: challenge.id } }));
          }
        }}
      />
      <div className="flex-1 flex flex-col w-full">
        <ClientOnly fallback={<ChallengeChatFallback challenge={challenge} />}>
          {() => <ChallengeChatClient challenge={challenge} />}
        </ClientOnly>
      </div>
    </div>
  );
}
