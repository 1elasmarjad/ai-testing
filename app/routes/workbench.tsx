import React from 'react';
import PageLayout from '~/components/header/PageLayout';

export default function WorkbenchPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Workbench Page</h1>
        <p className="text-lg text-[#a1a1aa]">This is your workbench for projects and experiments.</p>
      </div>
    </PageLayout>
  );
}
