import React from 'react';
import PageLayout from '~/components/header/PageLayout';

export default function HomePage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
        <p className="text-lg text-[#a1a1aa]">This is your new Home page. Use the menu bar to navigate.</p>
      </div>
    </PageLayout>
  );
}
