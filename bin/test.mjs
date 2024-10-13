import path from 'node:path';
import { spawn } from 'node:child_process';

/**
 * Run all tests for the given library
 * @param {object} options - The options object
 * @param {string} options.library - The library to test
 * @returns {Promise<void>}
 */
const test = async ({ library }) => {
	console.log(`Running tests for ${library}`);

	// Resolve paths in a cross-platform way
	const mainFolder = path.join(process.cwd(), 'lib', library);

	const spwn = spawn(
		'npx',
		[
			'jest',
			'--verbose',
			'--color',
			'--coverage',
			'--coverageProvider=v8',
			`--config=${path.join(process.cwd(), 'jest.config.js')}`,
			// Specify the folder where Jest should look for tests
			`${mainFolder}`,
		],
		{
			stdio: 'inherit',
			// Set cwd to the project root
			cwd: mainFolder,
			shell: true,
		},
	);

	spwn.on('exit', (code) => {
		if (code !== 0) {
			console.error(`Failed to test ${library}`);
			process.exit(1);
		}
	});

	spwn.on('error', (error) => {
		console.error(error);
		process.exit(1);
	});

	spwn.on('close', () => {
		console.log(`Tested ${library}`);
	});
};

export default test;
