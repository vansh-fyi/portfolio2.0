import App from '@/src/App';

// Slice 1 of the port: the existing single-page app, unchanged, rendered by Next.
// Slice 2 replaces its view switch with real routes.
export default function Home() {
  return <App />;
}
