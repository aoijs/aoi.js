import { spawn } from 'node:child_process';
import path from 'node:path';

/**
 * publish the given library
 * @param {object} options - the options object
 * @param {string} options.library - the library to publish
 * @returns {Promise<void>}
 */
const publish = async ({ library }) => {
	const mainFolder = path.resolve(process.cwd(), `lib/${library}`);
	console.log(mainFolder);

	const proc = spawn('npm', ['publish'], {
		cwd: mainFolder,
		stdio: 'inherit',
	});

	proc.on('exit', (code) => {
		if (code !== 0) {
			console.error(`Failed to publish ${library}`);
			process.exit(1);
		}
	});

	proc.on('error', (error) => {
		console.error(error);
		process.exit(1);
	});

	proc.on('close', () => {
		console.log(`Published ${library}`);
	});

	proc.on('disconnect', () => {
		console.log('Disconnected');
	});
};

export default publish;
