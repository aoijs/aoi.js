import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import chalk from 'chalk';
/**
 * generate all tests for the given library at the given folder
 * @param {object} options - The options object
 * @param {string} options.library - The library to test
 * @returns {Promise<void>}
 */
const genTest = async ({ library, folder }) => {
	const start = performance.now();
	console.log(`Generating tests for ${library} at ${folder }`);

	// Resolve paths in a cross-platform way
	const mainFolder = path.join(process.cwd(), 'lib', library);

	const flags = folder ? `--folder=${folder}` : '';

	const generatorPath = library === 'aoi.js' ? ['aoijs-tooling', 'testGenerator.mjs'] : ['aoijs-tooling', 'testGenerator.mjs'];

	const runnerPath = path.join(
		process.cwd(),
		'tools',
		...generatorPath,
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
		console.log(`Generated tests in ${folder} for ${library}`);
		console.log(
			chalk.gray(
				`Duration: ${((performance.now() - start) / 1000).toFixed(2)}s`,
			),
		);
	});
};

export default genTest;
