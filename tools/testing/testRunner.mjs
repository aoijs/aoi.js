import { run } from 'node:test';
import process from 'node:process';
import customReporter from './testReporter.mjs';
import * as glob from 'glob';

const argvs = process.argv.slice(3);

const flags = argvs.reduce((acc, arg) => {
	const [key, value] = arg.split('=');
	acc[key.replace('--', '')] = value;
	return acc;
}, {});

// recursively go through src folder and find all test files
let globBase = './src';
if (flags.folder) {
	globBase += `/${flags.folder}`;
}

let reporter = customReporter;

const files = glob.sync(`${globBase}/**/*.test.ts`);

const testStream = run({
	files,
	timeout: 60 * 1000,
	concurrency: true,
	forceExit: true,
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
testStream.compose(reporter).pipe(process.stdout);
