import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@services/(.*)$": "<rootDir>/src/domain/services/$1",
    "^@services$": "<rootDir>/src/domain/services",
    "^@repositories/(.*)$": "<rootDir>/src/domain/repositories/$1",
    "^@repositories$": "<rootDir>/src/domain/repositories",
    "^@schemas/(.*)$": "<rootDir>/src/domain/schemas/$1",
    "^@schemas$": "<rootDir>/src/domain/schemas",
    "^@infra/(.*)$": "<rootDir>/src/infra/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
    "^@types$": "<rootDir>/src/types",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
  },

  moduleDirectories: ["node_modules", "<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  clearMocks: true,
  testMatch: ["**/tests/**/*.test.ts"],

  collectCoverageFrom: [
    "src/**/*.{ts,tsx,js,jsx}",
    "!src/tests/**/*.test.ts",
    "!src/**/index.ts",
  ],
};

export default config;
