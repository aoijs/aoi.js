import path from 'node:path';
import { spawn } from 'node:child_process';

/**
 * Run given path for the given library
 * @param {object} options - The options object
 * @param {string} options.library - The library to test
 * @param {string} options.path - The path to the file that needs to be run
 * @returns {Promise<void>}
 */
const run = async ({ library, file: filePath }) => {
	console.log(`Running ${filePath} from ${library}`);

	// Resolve paths in a cross-platform way
	const mainFolder = path.join(process.cwd(), 'lib', library);

	const spwn = spawn(
		`node ${filePath}`,
		[],
		{
			stdio: 'inherit',
			// Set cwd to the project root
			cwd: mainFolder,
			shell: true,
		},
	);

	spwn.on('exit', (code) => {
		if (code !== 0) {
			console.error(`Failed to run ${filePath} from ${library}`);
			process.exit(1);
		}
	});

	spwn.on('error', (error) => {
		console.error(error);
		process.exit(1);
	});

	spwn.on('close', () => {
		console.log(`finished running ${filePath} from ${library}`);
	});
};

export default run;
