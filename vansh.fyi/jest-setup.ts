import '@testing-library/jest-dom';

// Components read the route and navigate through next/navigation; there is no App Router in unit tests.
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn(), prefetch: jest.fn() })),
}));
