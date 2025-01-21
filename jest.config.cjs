module.exports = {
  transform: {
    "^.+\\.m?[jt]sx?$": "babel-jest",
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  roots: ["./src"],
  setupFilesAfterEnv: ["./jest.setup.js"]
};
