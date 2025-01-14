/* eslint-disable @typescript-eslint/no-unsafe-call */
import { run } from 'node:test';

import process from 'node:process';
import customReporter from './testReporter.mjs';
import * as glob from 'glob';
import { lcov, tap } from 'node:test/reporters';
import { createWriteStream, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const argvs = process.argv.slice(3);

const flags = argvs.reduce((acc, arg) => {
	const [key, value] = arg.split('=');
	acc[key.replace('--', '')] = value;
	return acc;
}, {});

// recursively go through src folder and find all test files
let globBase = process.cwd() ;
if (flags.folder) {
	globBase += `/${flags.folder}`;
}

let reporter = customReporter;

let files = undefined;

if (flags.folder) {
	if (flags.folder.endsWith('.test.ts') || flags.folder.endsWith('.test.js')) {
		files = [flags.folder];
	} else {
		files = await glob.glob(`${globBase}/**/*.test.js`);
	}
}


const testStream = run({
	files,
	timeout: 60 * 1000,
	concurrency: true,
	forceExit: true,	
	inspectPort: 3000,
	// 'coverage': true,
});

// const lcovfile = path.resolve(process.cwd(), '../', './.coverage/lcov.info');
// console.log(lcovfile);
// const coveragePath = path.resolve(process.cwd(), '../', './.coverage');
// if (!existsSync(coveragePath)) {
// 	mkdirSync(coveragePath);
// }

// if (!existsSync(lcovfile)) {
// 	writeFileSync(lcovfile, '');
// }

// const lcovStream = createWriteStream(lcovfile);

// add lcov coverage and custom reporter , lcov prints to lcov.info while custom reporter prints to stdout
// testStream.compose(lcov).pipe(lcovStream);

testStream.compose(reporter).pipe(process.stdout);
