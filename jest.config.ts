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
  
  // 1. Tell Jest exactly which files to look for (unit tests only)
  testMatch: [
    "<rootDir>/tests/unit/**/*.test.{ts,tsx,js,jsx}",
    "<rootDir>/tests/unit/**/*.spec.{ts,tsx,js,jsx}"
  ],
  
  // 2. Explicitly tell Jest to ignore the Playwright E2E folder
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/tests/e2e/"
  ],

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