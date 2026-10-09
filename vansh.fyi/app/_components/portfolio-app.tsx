import App from '@/src/App';
import { PortfolioProvider } from '@/src/state/portfolio';
import { getPortfolio } from '@/server/projects/queries';

/**
 * The single-page portfolio with its project data. A server component, so the data is fetched on the
 * server (cached by the page's revalidate setting) and handed to the client views as context.
 */
export default async function PortfolioApp() {
  const data = await getPortfolio();
  return (
    <PortfolioProvider data={data}>
      <App />
    </PortfolioProvider>
  );
}
