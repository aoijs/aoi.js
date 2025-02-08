import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $ternary } from './$ternary.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';
import { log } from 'node:console';

const client = new TestClient();
client.transpiler.addFunctions({ $ternary });

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

const codeToFail = '$ternary';
const codeToPass = '$ternary[true;test;test]';
const codeWithTrue = '$ternary[1 == 1;hi;bye]';
const codeWithFalse = '$ternary[1 == 2;hi;bye]';

void describe('$ternary', () => {
	void it('should not compile successfully without arg', () => {
		// expect this to throw an error
		assert.throws(() => {
			client.transpiler.transpile(codeToFail, transpilerOptions);
		});
	});

	void it('should compile successfully without arg', () => {
		const func = client.transpiler.transpile(codeToPass, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});

	void it('should give hi with truthy condition', async () => {
		const { func } = client.transpiler.transpile(
			codeWithTrue,
			transpilerOptions,
		);
		const originalLog = console.log;
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $ternary.returns);
		};

		// @ts-expect-error: func is a function
		await func?.();
		console.log = originalLog;
		assert.strictEqual(logged, 'hi');
	});

	void it('should give bye with falsey condition', async () => {
		const { func } = client.transpiler.transpile(
			codeWithFalse,
			transpilerOptions,
		);
		const originalLog = console.log;
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $ternary.returns);
		};

		// @ts-expect-error: func is a function
		await func?.();
		console.log = originalLog;
		assert.strictEqual(logged, 'bye');
	});
});
