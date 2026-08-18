import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/../tsconfig.spec.json",
      },
    ],
  },
  collectCoverageFrom: [
    "auth/auth.guard.ts",
    "auth/auth.service.ts",
    "user/user.service.ts",
    "user/domain/staff-access.ts",
    "!**/*.spec.ts",
    "!**/*.module.ts",
    "!**/dto/**",
  ],
  coverageDirectory: "../coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/../test/jest.setup.ts"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/$1",
    "^uuid$": "<rootDir>/../test/mocks/uuid.ts",
    "^@starter/utils$": "<rootDir>/../../../packages/utils/src/index.ts",
    "^@starter/types$": "<rootDir>/../../../packages/types/src/index.ts",
  },
  transformIgnorePatterns: ["node_modules/(?!uuid|@starter/)"],
  maxWorkers: process.env.CI ? "50%" : 2,
};

export default config;
