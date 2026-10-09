import PortfolioApp from '@/app/_components/portfolio-app';

// Regenerated hourly, and immediately when projects change in the admin
export const revalidate = 3600;

export default function Home() {
  return <PortfolioApp />;
}
