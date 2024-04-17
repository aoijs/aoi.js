import ora from 'ora';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * walk the folder and add license to all .ts files
 * @param {string[]} filesOrDirs - the files or directories to walk
 * @param {string} currentPath - the current path
 * @param {string} license - the license to add
 * @param {number} indent - the indentation level
 * @returns {Promise<void>}
 */
const walkAndWrite = async (filesOrDirs, currentPath, license, indent = 4) => {
	for (const fileOrDir of filesOrDirs) {
		let spinner = ora({
			text: `Resolving ${fileOrDir}`,
			color: 'yellow',
			spinner: 'dots',
			indent,
		}).start();

		const fullPath = path.resolve(currentPath, fileOrDir);
		spinner.succeed();

		const stat = await fs.stat(fullPath);
		if (stat.isDirectory()) {
			const filesAndDirs = await fs.readdir(fullPath);
			await walkAndWrite(filesAndDirs, fullPath, license, indent * 2);
		} else {
			if (fileOrDir.endsWith('.ts') && !fileOrDir.endsWith('.d.ts') && !fileOrDir.endsWith('.spec.ts') && !fileOrDir.endsWith('.test.ts')) {
				const fileContent = await fs.readFile(fullPath, 'utf-8');

				if (!fileContent.startsWith('/*\nCopyright')) {
					spinner = ora({
						text: `Adding license to ${fileOrDir}`,
						color: 'yellow',
						spinner: 'dots',
						indent,
					}).start();

					await fs.writeFile(
						fullPath,
						`/*\n${license}\n*/\n\n${fileContent}`,
					);
					spinner.succeed();
				}
			}
		}
	}
};

const addLicense = async ({ library }) => {
	const spinner = ora({
		text: `Adding license to ${library}`,
		color: 'yellow',
		spinner: 'dots',
		indent: 0,
	}).start();

	const license = ` Copyright ${new Date().getFullYear()} Akarui Development

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
 
		http://www.apache.org/licenses/LICENSE-2.0
 
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.`;

	const libPath = path.resolve(__dirname, `../lib/${library}`);

	// add license to all files in the lib that ends with .ts
	const files = await fs.readdir(libPath);
	await walkAndWrite(files, libPath, license, 1);

	spinner.succeed();
};

export default addLicense;
