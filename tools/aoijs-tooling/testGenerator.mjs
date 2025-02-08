/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// import { ReturnType } from '@aoirepo/aoi.js/src/typings/enum.ts';
import { existsSync } from 'node:fs';
import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baseFile = (fn) => `import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { ${fn} } from './${fn}.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ ${fn} });

const transpilerOptions: ITranspileOptions = {
	scopeData: {
		name: 'global',
		vars: [],
		embeds: [],
		env: [],
		object: {},
		embeddedJS: [],
		sendFunction: 'console.log',
	},
	command: new TestCommand(client),
};
`;

function defaultValueBasedOnType(type) {
	switch (type) {
		case 8:
			return 'test';
		case 4:
			return Math.floor(Math.random() * 200);
		case 16:
			return true;
		case 32:
			return JSON.stringify({ a: 1 });
		case 2:
			return 'test';
		case 1:
			return;
		case 64 | 8:
			return 'test;test';
		case 64 | 4:
			return '200;200';
		default:
			return 'test';
	}
}

/**
 * Generate tests for a function
 * @param {string} fnPath - The path to the function file
 * @returns {Promise<string>} - The generated test string
 */
async function _generateTests(fnPath) {
	const fn = fnPath.split('/').pop().replace('.ts', '');
	// fnPath = fnPath.replace('.ts', '.js');
	fnPath = pathToFileURL(fnPath);

	const module = await import(fnPath);
	console.log(`Generating tests for ${fn}`);
	let testString = baseFile(fn);
	const object = module[fn];
	let hasCodeToFail = false;
	let hasCodeToPass = false;
	let hasCodeToPassWithArg = false;

	if (object.fields.length) {
		// If the function has arguments and optional usage
		if (object.optional && object.brackets) {
			testString += `
const codeToPass = '${fn}';
const codeToPassWithArg = '${fn}[${object.fields
	.map((field) => defaultValueBasedOnType(field.type))
	.join(';')}]';
`;

			hasCodeToPass = true;
			hasCodeToPassWithArg = true;
		} else {
			// Generate codeToFail and codeToPass if the function requires arguments
			testString += `
const codeToFail = '${fn}';
const codeToPass = '${fn}[${object.fields
	.map((field) => defaultValueBasedOnType(field.type))
	.join(';')}]';
`;

			hasCodeToFail = true;
			hasCodeToPass = true;
		}
	} else if (!object.brackets) {
		// No arguments and no brackets, so only generate codeToPass
		testString += `
const codeToPass = '${fn}';
`;
		hasCodeToPass = true;
	}

	testString += `
void describe('${fn}', () => {
	${
	hasCodeToFail
		? `void it('should not compile successfully without arg', () => {
		// expect this to throw an error
		assert.throws(() => {
			client.transpiler.transpile(codeToFail, transpilerOptions);
		});
	});`
		: ''
}

	${
	hasCodeToPass
		? `void it('should compile successfully without arg', () => {
		const func = client.transpiler.transpile(codeToPass, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});`
		: ''
}

	${
	hasCodeToPassWithArg
		? `void it('should compile successfully with arg', () => {
		const func = client.transpiler.transpile(codeToPassWithArg, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});`
		: ''
}
});
`;

	return testString;
}

/**
 * Generate tests for all files in a directory
 * @param {string} fpath - The path to the directory
 */
export async function generateTest(fpath) {
	if (!existsSync(fpath))
		throw new Error(
			`The path ${fpath} does not exist. Please provide a valid path.`,
		);

	const isDir = (await stat(fpath)).isDirectory();

	if (isDir) {
		const files = await readdir(fpath);
		const existingTestFiles = files.filter((file) =>
			file.endsWith('.test.ts'),
		);
		const filteredFiles = files.filter(
			(file) =>
				file.endsWith('.ts') &&
				!file.endsWith('.test.ts') &&
				file.startsWith('$'),
		);

		const filesToGenerate = filteredFiles.filter(
			(file) =>
				!existingTestFiles.includes(file.replace('.ts', '.test.ts')),
		);

		for (const file of filesToGenerate) {
			const testString = await _generateTests(`${fpath}/${file}`);
			const testPath = `${fpath}/${file.replace('.ts', '.test.ts')}`;
			await writeFile(testPath, testString);
		}
	}
}

const argvs = process.argv.slice(3);

const flags = argvs.reduce((acc, arg) => {
	const [key, value] = arg.split('=');
	acc[key.replace('--', '')] = value;
	return acc;
}, {});

// recursively go through src folder and find all test files
let fpPath = './src';
if (flags.folder) {
	fpPath += `/${flags.folder}`;
}

fpPath = path.resolve(process.cwd(), fpPath);

await generateTest(fpPath);
