import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import chalk from 'chalk';
/**
 * Run all tests for the given library
 * @param {object} options - The options object
 * @param {string} options.library - The library to test
 * @returns {Promise<void>}
 */
const test = async ({ library, folder, reporter }) => {
	const start = performance.now();
	console.log(`Running tests for ${library}`);

	// Resolve paths in a cross-platform way
	const mainFolder = path.join(process.cwd(), 'lib', library);
	const reporterPath = pathToFileURL(
		path.join(process.cwd(), 'tools', 'testing', 'testReporter.mjs'),
	);
	const flags = folder ? `--folder=${folder}` : '';
	const runnerPath = path.join(
		process.cwd(),
		'tools',
		'testing',
		'testRunner.mjs',
	);
	// "glob -c \"tsx --test\" \"./src/**/*.test.ts\""
	const spwn = spawn(
		// `npx glob -c  "tsx --test-reporter="${reporterPath.toString()}" --test" "./src/**/*.test.ts"`,
		`node --import tsx "${runnerPath.toString()}" -- ${flags}`,
		[],
		{
			stdio: 'inherit',
			// Set cwd to the project root
			cwd: `${mainFolder}`,
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
		console.log(
			chalk.gray(
				`Duration: ${((performance.now() - start) / 1000).toFixed(2)}s`,
			),
		);
	});
};

export default test;
