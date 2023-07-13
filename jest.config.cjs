module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testRegex: "/tests/(unit|integration)/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/__mocks__/styleMock.js",
  },
};
