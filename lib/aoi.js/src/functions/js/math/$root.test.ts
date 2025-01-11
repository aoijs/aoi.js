import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $root } from './$root.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $root });

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

const codeToFail = '$root';
const codeToPass = '$root[200;2]';
const codeToCalc = '$root[400;2]';

void describe('$root', () => {
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

	void it('should return 20 for sqrt(400)', async () => {
		const { func } = client.transpiler.transpile(codeToCalc, transpilerOptions);
		const orignalLog = console.log;
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $root.returns);
		};

		// @ts-expect-error: func is a function
		await func?.();
		console.log = orignalLog;
		assert.strictEqual(logged, 20);
	});
});
