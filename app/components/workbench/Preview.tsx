import { useStore } from '@nanostores/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import { type Challenge } from '~/lib/challenges';
import { PortDropdown } from './PortDropdown';

interface PreviewProps {
  showTarget?: boolean;
  challengeData?: Challenge;
}

export const Preview = memo(({ showTarget = false, challengeData }: PreviewProps) => {
  console.log(
    'Preview component - showTarget:',
    showTarget,
    'challengeData:',
    challengeData,
    'image:',
    challengeData?.image,
  );

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isPortDropdownOpen, setIsPortDropdownOpen] = useState(false);
  const hasSelectedPreview = useRef(false);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];

  // when previews change, display the lowest port if user hasn't selected a preview
  useEffect(() => {
    if (previews.length > 1 && !hasSelectedPreview.current) {
      const minPortIndex = previews.reduce(findMinPortIndex, 0);

      setActivePreviewIndex(minPortIndex);
    }
  }, [previews]);

  const findMinPortIndex = useCallback(
    (minIndex: number, preview: { port: number }, index: number, array: { port: number }[]) => {
      return preview.port < array[minIndex].port ? index : minIndex;
    },
    [],
  );

  return (
    <div className="w-full h-full flex flex-col">
      {isPortDropdownOpen && (
        <div className="z-iframe-overlay w-full h-full absolute" onClick={() => setIsPortDropdownOpen(false)} />
      )}
      <div className="bg-bolt-elements-background-depth-2 p-2 flex items-center gap-1.5">
        {/* <IconButton icon="i-ph:arrow-clockwise" onClick={reloadPreview} /> */}
        {/* Removed URL/address bar and X button */}
        {previews.length > 1 && (
          <PortDropdown
            activePreviewIndex={activePreviewIndex}
            setActivePreviewIndex={setActivePreviewIndex}
            isDropdownOpen={isPortDropdownOpen}
            setHasSelectedPreview={(value) => (hasSelectedPreview.current = value)}
            setIsDropdownOpen={setIsPortDropdownOpen}
            previews={previews}
          />
        )}
      </div>
      <div className="flex-1 border-t border-bolt-elements-borderColor">
        {showTarget ? (
          challengeData?.image ? (
            <div className="w-full h-full bg-gray-500 flex justify-center items-center relative p-0">
              <img
                src={challengeData.image}
                alt="Target result"
                className="w-auto h-auto max-h-[98vh] max-w-[98vw] object-contain bg-white shadow-lg"
                style={{ maxWidth: '98vw' }}
              />
              <div className="absolute bottom-4 right-4 text-white text-sm font-semibold opacity-70 bg-red-500/80 px-2 py-1 rounded flex items-center gap-1">
                <div className="i-ph:warning" />
                VIEWING TARGET
              </div>
            </div>
          ) : (
            <div className="flex w-full h-full justify-center items-center bg-gray-500 text-white">
              <div className="text-center">
                <div className="text-lg mb-2">No target image available</div>
                <div className="text-sm opacity-70">This challenge doesn't have a target image set</div>
              </div>
            </div>
          )
        ) : activePreview ? (
          <iframe ref={iframeRef} className="border-none w-full h-full bg-white" src={activePreview.baseUrl} />
        ) : (
          <div className="flex w-full h-full justify-center items-center bg-white">No preview available</div>
        )}
      </div>
    </div>
  );
});
