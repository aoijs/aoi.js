export default {
	// Global setup for all projects
	globals: {},
	testEnvironment: 'node',
	preset: 'ts-jest',
	// Define each library as a project
	projects: [
		{
			displayName: 'aoi.js',
			preset: 'ts-jest/presets/default-esm',
			testEnvironment: 'node',
			rootDir: '.',
			moduleNameMapper: {
				'^@aoi\\.js([a-z0-9A-Z\\/\\\\$]+)(?:\\.js)?$': '<rootDir>/src$1',
				'^(.*)\\.js$': '$1',
			},
			extensionsToTreatAsEsm: ['.ts'],
			globals: {
				'ts-jest': {
					tsconfig: './tsconfig.json',
					useESM: true,
					isolatedModules: true,
				},
			},
		},
		// Add more libraries as needed
	],
};
