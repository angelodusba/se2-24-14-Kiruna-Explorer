module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**test**/**/*.test.ts"],
  reporters: ["default"],
  setupFiles: ["./jest.setup.js"],
};
