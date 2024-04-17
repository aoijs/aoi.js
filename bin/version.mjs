import path from 'node:path';
import fs from 'node:fs/promises';
import ora from 'ora';

/**
 * increment the version of the given library
 * @param {object} options - the options object
 * @param {string} options.library - the library to version
 * @param {'major' | 'minor' | 'patch'} options.semver - the semver to increment
 * @returns {Promise<void>}
 */
const version = async ({ library, semver }) => {
	const spinner = ora('Versioning library').start();
	try {
		const mainFolder = path.resolve(process.cwd(), `lib/${library}`);
		const packagePath = path.resolve(mainFolder, 'package.json');
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
		const packageJson = await fs.readFile(packagePath, 'utf-8').then((data) => JSON.parse(data));

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
		let version = packageJson.version.split('.').map((v) => parseInt(v));

		switch (semver) {
			case 'major':
				version[0]++;
				version[1] = 0;
				version[2] = 0;
				break;
			case 'minor':
				version[1]++;
				version[2] = 0;
				break;
			case 'patch':
				version[2]++;
				break;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
		packageJson.version = version.join('.');

		await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
		spinner.succeed(`Versioned ${library}`);
	} catch (error) {
		spinner.fail(`Failed to version ${library}
	${
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	error.toString()
}`);
		process.exit(1);
	}
};

export default version;