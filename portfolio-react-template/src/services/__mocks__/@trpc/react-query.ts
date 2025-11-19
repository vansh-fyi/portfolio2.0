export const useQueryMock = jest.fn();

// Mock tRPC client that matches the AppRouter structure
export const createTRPCReact = () => ({
  Provider: ({ children }: any) => children,
  createClient: jest.fn(),
  useContext: jest.fn(),
  useUtils: jest.fn(),
  rag: {
    query: {
      useQuery: useQueryMock,
      useMutation: jest.fn(),
      useSubscription: jest.fn(),
    },
  },
  email: {
    sendLead: {
      useQuery: jest.fn(),
      useMutation: jest.fn(),
    },
  },
});
