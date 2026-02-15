export default {
	testEnvironment: "jsdom",

	setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

	moduleNameMapper: {
		"\\.(css|less|scss)$": "<rootDir>/src/__mocks__/styleMock.cjs"
	},

	transform: {
		"^.+\\.(js|jsx)$": "babel-jest"
	},

	transformIgnorePatterns: ["/node_modules/"]
};

