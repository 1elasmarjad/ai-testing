import { MenuBar } from './MenuBar';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MenuBar />
      <main>{children}</main>
    </>
  );
}
