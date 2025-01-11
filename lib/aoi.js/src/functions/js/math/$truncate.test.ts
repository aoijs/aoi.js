import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $truncate } from './$truncate.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $truncate });

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

const codeToFail = '$truncate';
const codeToPass = '$truncate[200]';
const codeToCalc = '$truncate[200.53434]';

void describe('$truncate', () => {
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

	void it('should return 200 for 200.53434', async () => {
		const { func } = client.transpiler.transpile(
			codeToCalc,
			transpilerOptions,
		);
		const orignalLog = console.log;
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $truncate.returns);
		};

		// @ts-expect-error: func is a function
		await func?.();
		console.log = orignalLog;
		assert.strictEqual(logged, 200);
	});
});
