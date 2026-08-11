import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: [""],
  },

  transform: {
    '^.+\\.[tj]sx?$': 'esbuild-jest',
    '^.+\\.mjs$': 'esbuild-jest',
  },
};

// Export an async function to override Next.js defaults AFTER nextJest resolves
export default async (): Promise<Config> => {
  const nextConfig = await createJestConfig(config)();
  return {
    ...nextConfig,
    transformIgnorePatterns: [
      "/node_modules/(?!(msw|@mswjs|@open-draft|rettime|headers-polyfill|until-async)/)",
    ],
  };
};