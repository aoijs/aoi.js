import path from 'node:path';
<<<<<<< HEAD
import { exec, spawn } from 'node:child_process';
import chalk from 'chalk';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

=======
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import chalk from 'chalk';
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
/**
 * Run all tests for the given library
 * @param {object} options - The options object
 * @param {string} options.library - The library to test
<<<<<<< HEAD
 * @param {string} [options.folder] - The folder to test
 * @returns {Promise<void>}
 */
const test = async ({ library, folder }) => {
=======
 * @returns {Promise<void>}
 */
const test = async ({ library, folder, reporter }) => {
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	const start = performance.now();
	console.log(`Running tests for ${library}`);

	// Resolve paths in a cross-platform way
	const mainFolder = path.join(process.cwd(), 'lib', library);
<<<<<<< HEAD
=======
	const reporterPath = pathToFileURL(
		path.join(process.cwd(), 'tools', 'testing', 'testReporter.mjs'),
	);
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	const flags = folder ? `--folder=${folder}` : '';
	const runnerPath = path.join(
		process.cwd(),
		'tools',
		'testing',
		'testRunner.mjs',
	);
<<<<<<< HEAD

	if (!folder?.endsWith('.test.ts')) {
		if (existsSync(mainFolder + '/.tmp')) {
			await rm(mainFolder + '/.tmp', { recursive: true });
		}

		const build = await execAsync(
			`npx swc ./src -d ${mainFolder}/.tmp`,
			{
				cwd: mainFolder,
				shell: true,
			},
		);


		if (build.stderr) {
			console.error(build.stderr);
			process.exit(1);
		}
	}

	const spwn = spawn(
		// `npx glob -c  "tsx --test  --experimental-test-coverage --test-reporter=lcov --test-reporter=spec" "./src/**/*.test.ts"`,
		(folder?.endsWith('.test.ts'))
			? `node --import tsx "${runnerPath.toString()}" -- ${flags}` :
			`node "${runnerPath.toString()}" -- ${flags}`,
=======
	// "glob -c \"tsx --test\" \"./src/**/*.test.ts\""
	const spwn = spawn(
		// `npx glob -c  "tsx --test-reporter="${reporterPath.toString()}" --test" "./src/**/*.test.ts"`,
		`node --import tsx "${runnerPath.toString()}" -- ${flags}`,
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
		[],
		{
			stdio: 'inherit',
			// Set cwd to the project root
<<<<<<< HEAD
			cwd: (!folder?.endsWith('.test.ts'))
				? `${mainFolder}/.tmp/src` : `${mainFolder}/src`,
=======
			cwd: `${mainFolder}`,
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
			shell: true,
		},
	);

	spwn.on('exit', async (code) => {
		if (code !== 0) {
			console.error(`Failed to test ${library}`);

			if ((!folder?.endsWith('.test.ts'))) await rm(mainFolder + '/.tmp', { recursive: true });
			process.exit(1);
		}
	});

	spwn.on('error', (error) => {
		console.error(error);
		process.exit(1);
	});

	spwn.on('close', async () => {
		console.log(`Tested ${library}`);
		console.log(
			chalk.gray(
				`Duration: ${((performance.now() - start) / 1000).toFixed(2)}s`,
			),
		);
<<<<<<< HEAD

		if ((!folder?.endsWith('.test.ts'))) await rm(mainFolder + '/.tmp', { recursive: true });
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	});
};

export default test;
