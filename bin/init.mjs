import { exec } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

const execAsync =  promisify(exec);

async function initAoijs() {
	// first install all the deps in root
	// then build structures folder for aoi.js
	// cd into lib/aoi.js
	// run pnpm install
	// cd back to root
	// run aoirepo build -l aoi.js

	const root = process.cwd();
	const aoijs = './lib/aoi.js';

	console.log('Installing all dependencies in root...');
	let res = await execAsync('pnpm install -w', {
		cwd: root,
	});

	if (res.stderr) {
		console.error(res.stderr);
		return;
	}

	console.log('Patching tsc with ts-patch...');
	res = await execAsync('npx ts-patch install', {
		cwd: root,
	});

	if (res.stderr) {
		console.error(res.stderr);
		return;
	}

	console.log('Building structures folder for aoi.js...');
	res = await execAsync('aoirepo build -l structures', {
		cwd: root,
	});

	if (res.stderr) {
		console.error(res.stderr);
		return;
	}

	console.log('Installing all dependencies in aoi.js...');

	res = await execAsync('pnpm install', {
		cwd: path.resolve(root, aoijs),
	});

	if (res.stderr) {
		console.error(res.stderr);
		return;
	}

	console.log('Building aoi.js...');
	res = await execAsync('aoirepo build -l aoi.js', {
		cwd: root,
	});

	if (res.stderr) {
		console.error(res.stderr);
		return;
	}

	console.log('Done!');
}

export async function init({ library }) {
	if (library === 'aoi.js') {
		await initAoijs();
	}

	process.exit(0);
}