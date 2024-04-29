import path from 'node:path';
import { spawn } from 'node:child_process';

/**
 * run all tests for the given library
 * @param {object} options - the options object
 * @param {string} options.library - the library to test
 * @returns {Promise<void>}
 */
const test = async ({ library }) => {
	console.log(`Running tests for ${library}`);

	// find all test files in the library
	// recursively check all folders for test files
	const mainFolder = path.resolve(process.cwd(), `lib/${library}`);

	const spwn = spawn(
		'npx',
		[
			'jest',
			'--verbose',
			'--color',
			'--coverage',
			'--coverageProvider=v8',
			`--config=${process.cwd()}/jest.config.js`,
			`${mainFolder}`,
		],
		{
			stdio: 'inherit',
			cwd: mainFolder,
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

	spwn.on('disconnect', () => {
		console.log('Disconnected');
	});
};

export default test;
