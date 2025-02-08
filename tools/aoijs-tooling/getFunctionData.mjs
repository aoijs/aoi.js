/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import fs, { existsSync } from 'fs';
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';
import { argv } from 'process';
import { pathToFileURL } from 'url';

const returnType = {
	1: 'Void',
	2: 'Any',
	4: 'Number',
	8: 'String',
	16: 'Boolean',
	32: 'Object',
	64: 'Array',
	128: 'Fn',
	256: 'BigInt',
};

const functionType = {
	0: 'Setter',
	1: 'Getter',
	2: 'Function',
	3: 'FunctionGetter',
	4: 'Scope',
	5: 'ScopeGetter',
};

// getAll ReturnTypes that are or'd

const getReturnType = (type) => {
	const res = [];
	for (const key in ReturnType) {
		if (type & Number(key)) {
			res.push(returnType[key]);
		}
	}

	return res;
};

/**
 * Get the function data from the given file
 * @param {string} fnPath - The file path
 * @returns {Promise<object>} - The function data
 */
async function _getFnData(fnPath) {
	const fn = fnPath.split(path.sep).pop().replace('.ts', '').split('/').pop();
	// fnPath = fnPath.replace('.ts', '.js');
	fnPath = pathToFileURL(fnPath);
	// console.log(fnPath);
	const module = await import(fnPath);
	// console.log(module, fn);
	const object = module[fn];
	for (const key in object) {
		if (key === 'fields') {
			for (const field of object[key]) {
				field.type = getReturnType(field.type);
			}
		} else if (key === 'type') {
			object[key] = functionType[object[key]];
		} else if (key === 'returns') {
			object[key] = getReturnType(object[key]);
		}
	}

	// console.log(module, object, fn, fnPath);
	return object;
}

/**
 * Get the jsDoc content from the given file
 * @param {string} fpPath - The file path
 */
async function getJsDocContent(fpPath) {
	// read the jsDoc from the file
	const content = await readFile(fpPath, 'utf-8');

	// extract the jsDoc
	let jsDoc = content.match(/\/\*\*([\s\S]*?)\*\//g);

	// console.log(jsDoc);
	if (!jsDoc) {
		console.log('No jsDoc found, file: ', fpPath);
		return {};
	}

	jsDoc = jsDoc[0].split('/**')[1].trim().split('*/')[0].trim();

	const description = jsDoc
		.split('@')[0]
		.trim()
		.replaceAll('*', '')
		.split('\n')
		.map((line) => line.trim())
		.join('\n');

	const example = jsDoc
		.split('@example')[1]
		.trim()
		.replaceAll('*', '')
		.split('\n')
		.map((line) => line.trim())
		.join('\n');

	const remarks = jsDoc
		.split('@remarks')[1]
		?.trim()
		.replaceAll('*', '')
		.split('\n')
		.map((line) => line.trim())
		.join('\n')
		.split('@')[0]
		.trim();

	const notes = jsDoc
		.split('@notes')[1]
		?.trim()
		.replaceAll('*', '')
		.split('\n')
		.map((line) => line.trim())
		.join('\n')
		.split('@')[0]
		.trim();

	return {
		description,
		example,
		remarks,
		notes,
	};
}

/**
 * get the function Metadata from the given file
 * @param {string} fpath - The path to the directory
 */
export async function getMetaData(fpath) {
	if (!existsSync(fpath))
		throw new Error(
			`The path ${fpath} does not exist. Please provide a valid path.`,
		);

	const isDir = (await stat(fpath)).isDirectory();

	if (isDir) {
		const files = await readdir(fpath);

		const filteredFiles = files.filter(
			(file) =>
				file.endsWith('.ts') &&
				!file.endsWith('.test.ts') &&
				file.startsWith('$'),
		);

		const res = [];

		for (const file of filteredFiles) {
			const jsDocData = await getJsDocContent(`${fpath}/${file}`);
			const fnData = await _getFnData(`${fpath}/${file}`);
			// console.log({jsDocData, fnData});
			res.push({
				...jsDocData,
				...fnData,
			});
		}

		return res;
	} else {
		const jsDocData = await getJsDocContent(fpath);
		const fnData = await _getFnData(fpath);
		// console.log({fnData, jsDocData});
		return {
			...jsDocData,
			...fnData,
		};
	}
}

export default async function getFunctionData() {
	const mainPath = path.resolve(process.cwd(), './src/functions');
	const dirs = await fs.promises.readdir(mainPath);

	const res = [];

	for (const dir of dirs) {
		if (dir === 'index.ts') continue;
		const subdirs = await fs.promises.readdir(path.resolve(mainPath, dir));

		for (const subdir of subdirs) {
			const data = await getMetaData(path.resolve(mainPath, dir, subdir));
			res.push(...(Array.isArray(data) ? data : [data]));
		}
	}

	return res;
}

const writePath = argv[2] || path.resolve(process.cwd(), 'docs', 'data.json');

if (!existsSync(path.dirname(writePath))) {
	await fs.promises.mkdir(path.dirname(writePath), { recursive: true });
}

await fs.promises.writeFile(
	writePath,
	JSON.stringify(await getFunctionData(), null, 2),
);
