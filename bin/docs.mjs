import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

/**
 * Generate the documentation for the given library
 * @param {object} param0 - The library to generate the documentation for
 * @param {string} param0.library - The library to generate the documentation for
 */
const docs = async ({ library }) => {
	console.log(`Generating documentation for ${library}`);

	let libPath = path.resolve(process.cwd(), 'tools');

	if (library === 'aoi.js') {
		libPath = path.resolve(libPath, 'aoijs-tooling', 'getFunctionData.mjs');
	}

	const savedJSONPath = path.resolve(process.cwd(), 'lib', library, 'docs', 'data.json');

	const { stdout, stderr } = await execAsync(`node --import tsx ${libPath}`, {
		cwd: path.resolve(process.cwd(), 'lib', library),
	});
};

export default docs;
