const path = require('path');

const setupTestFile = path.resolve('setup-tests.ts');

const config = require('@gpn-prototypes/frontend-configs/jest/jest.config')({
  setupFilesAfterEnv: setupTestFile,
});

module.exports = {
  ...config,
  transformIgnorePatterns: ['/node_modules/?!(@gpn-prototypes)'],
  modulePathIgnorePatterns: [...config.modulePathIgnorePatterns, '/e2e-tests/'],
  coveragePathIgnorePatterns: [...config.coveragePathIgnorePatterns, '/e2e-tests/'],
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  moduleNameMapper: {
    ...config.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports',
        suiteName: 'Jest Tests',
      },
    ],
  ],
};
