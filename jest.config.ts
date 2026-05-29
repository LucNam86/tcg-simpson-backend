import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
  },
  verbose: true,
  //silent: true,
    maxWorkers: 1,
  reporters: [
  "jest-standard-reporter",
  ["jest-html-reporter", {
    pageTitle: "TCG Simpson - Test Report",
    outputPath: "./coverage/report.html",
    includeSuccessfulHtmlReport: true,
  }]
],
coverageReporters: ["html", "text-summary"],
};

export default config;