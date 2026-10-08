const transform = {
  '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
};

export default {
  projects: [
    {
      displayName: 'web',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src'],
      transform,
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        // react-markdown is ESM-only; tests don't need real Markdown rendering
        '^react-markdown$': '<rootDir>/src/services/__mocks__/react-markdown.tsx',
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      setupFilesAfterEnv: ['./jest-setup.ts'],
    },
    {
      displayName: 'server',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/server'],
      testMatch: ['**/__tests__/**/*.test.ts'],
      transform,
      // ESM-only packages that server code imports (github-slugger matches rehype-slug's heading ids)
      transformIgnorePatterns: ['node_modules/(?!(github-slugger)/)'],
    },
  ],
};
