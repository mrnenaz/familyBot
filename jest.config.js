module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["src/tests"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  bail: 1,
  verbose: true,
};
