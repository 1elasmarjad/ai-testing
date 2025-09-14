import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { ChallengeChat as ChallengeChatFallback } from '~/components/chat/ChallengeChat';
import { ChallengeChatClient } from '~/components/chat/ChallengeChat.client';
import { Header } from '~/components/header/Header';
import { getChallengeById, type Challenge } from '~/lib/challenges';

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

  return (
    <div className="flex flex-col h-full min-h-screen w-full bg-bolt-elements-background-depth-1">
      {/* <Header className="bg-bolt-elements-background-depth-2 shadow-md" /> */}
      <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto mt-12 mb-0 p-0">
        {challenge.image && (
          <div className="w-full flex flex-col items-center justify-center mb-0">
            <img
              src={challenge.image}
              alt={challenge.title}
              className="h-[280px] w-auto max-w-full rounded-2xl shadow-2xl border-4 border-bolt-elements-background-depth-2 object-contain bg-bolt-elements-background-depth-1"
              style={{ objectFit: 'contain' }}
            />
            {challenge.title && (
              <h1 className="text-4xl font-extrabold text-white pt-4 mb-0 text-center drop-shadow-lg tracking-tight">
                {challenge.title}
              </h1>
            )}
            {challenge.difficulty && (
              <span
                className={`text-xs font-semibold mt-1 mb-2 opacity-60 ${challenge.difficulty === 'Easy' ? 'text-green-400' : challenge.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}
              >
                {challenge.difficulty}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-start pb-10">
        <ClientOnly fallback={<ChallengeChatFallback challenge={challenge} />}>
          {() => <ChallengeChatClient challenge={challenge} />}
        </ClientOnly>
      </div>
    </div>
  );
}