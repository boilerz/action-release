const jestConfig = require('@boilerz/jest-config');

module.exports = {
  ...jestConfig,
  modulePathIgnorePatterns: [
    ...jestConfig.modulePathIgnorePatterns,
    '<rootDir>/.*/__fixtures/.*',
  ],
};
