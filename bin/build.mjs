import { exec } from 'node:child_process';
import ora from 'ora';
import path from 'node:path';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';

const execAsync = promisify(exec);

const addPkgJson = async (library) => {
	const mainFolder = path.resolve(process.cwd(), `lib/${library}`);
	const newEsmPkgJson = {
		type: 'module',
	};
	const newCjsPkgJson = {
		type: 'commonjs',
	};

	const esmBuildPath = path.resolve(mainFolder, 'dist', 'esm');
	const cjsBuildPath = path.resolve(mainFolder, 'dist', 'cjs');

	await fs.writeFile(
		`${esmBuildPath}/package.json`,
		JSON.stringify(newEsmPkgJson, null, 2),
	);
	await fs.writeFile(
		`${cjsBuildPath}/package.json`,
		JSON.stringify(newCjsPkgJson, null, 2),
	);
};

/**
 * build the given library
 * @param {object} options - the options object
 * @param {string} options.library - the library to build
 * @returns {Promise<void>}
 */
const build = async ({ library }) => {
	const mainFolder = path.resolve(process.cwd(), `lib/${library}`);
	console.log(mainFolder);

	// run the build script

	const spinner = ora('Building library').start();

	await execAsync(
		'npx tsc -p tsconfig.esm.json && npx tsc -p tsconfig.cjs.json',
		{
			cwd: mainFolder,
			stdio: 'inherit',
		},
	).catch((error) => {
		spinner.fail(`Failed to build ${library}
	${error}`);
		process.exit(1);
	});

	await addPkgJson(library);

	spinner.succeed(`Built ${library}`);
};

export default build;
