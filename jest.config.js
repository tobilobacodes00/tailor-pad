/**
 * Pure-logic Jest config (ts-jest, node env). For component-rendering tests,
 * a separate jest-expo project would be added.
 */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/.expo/", "/dist/", "/android/", "/ios/"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react",
          esModuleInterop: true,
          allowJs: true,
          isolatedModules: true,
          paths: { "@/*": ["./*"] },
        },
      },
    ],
  },
};
