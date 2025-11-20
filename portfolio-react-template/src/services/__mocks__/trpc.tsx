import React from 'react';

// Mock tRPC client for testing
export const trpc = {
  email: {
    sendLead: {
      useMutation: jest.fn(() => ({
        mutateAsync: jest.fn().mockResolvedValue({ success: true }),
        isLoading: false,
        isError: false,
        isSuccess: false
      }))
    }
  },
  rag: {
    query: {
      useMutation: jest.fn()
    }
  }
};

export const queryClient = {
  clear: jest.fn(),
  invalidateQueries: jest.fn()
};

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
