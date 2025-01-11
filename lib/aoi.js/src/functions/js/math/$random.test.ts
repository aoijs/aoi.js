import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $random } from './$random.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $random });

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

const codeToFail = '$random';
const codeToPass = '$random[37;177;true]';
const codeToCalc = '$random[0;100]';
const codeToCalc2 = '$random[0;100;true]';

void describe('$random', () => {
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

	void it('should return a integer between 0 and 100', async () => {
		const { func } = client.transpiler.transpile(
			codeToCalc,
			transpilerOptions,
		);

		const orignalLog = console.log;
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $random.returns);
		};

		// @ts-expect-error: func is a function
		await func?.();
		console.log = orignalLog;
		assert.strictEqual(typeof logged, 'number');
		assert.strictEqual(Number.isInteger(logged as number), true);
		assert.ok((logged as number) >= 0 && (logged as number) <= 100);
	});

	void it('should return a float between 0 and 100', async () => {
		const { func } = client.transpiler.transpile(
			codeToCalc2,
			transpilerOptions,
		);
		const orignalLog = console.log;
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $random.returns);
		};

		// @ts-expect-error: func is a function
		await func?.();
		console.log = orignalLog;
		assert.strictEqual(typeof logged, 'number');
		assert.strictEqual(Number.isInteger(logged as number), false);
		assert.ok((logged as number) >= 0 && (logged as number) <= 100);
	});
});
