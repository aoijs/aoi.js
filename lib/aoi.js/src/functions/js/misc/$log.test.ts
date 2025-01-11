import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $log } from './$log.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $log });

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

const codeToFail = '$log';
const codeToPass = '$log[hi and bye]';
const codeToLogCorrectly = '$log[hi and bye]';


void describe('$log', () => {
	void it('should not compile successfully without arg', () => {
		
		// expect this to throw an error
		assert.throws(() => {
			client.transpiler.transpile(codeToFail, transpilerOptions);
		});
	});

	void it('should compile successfully with arg', () => {
		const func = client.transpiler.transpile(codeToPass, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});

	void it('should log correctly: hi and bye', async () => {
		// logs true
		const orignalLog = console.log;
		let logged: unknown;

		console.log = (log: string) => {
			logged = client.parseData(log, $log.returns);
		};

		const { func } = client.transpiler.transpile(codeToLogCorrectly, transpilerOptions);
		// @ts-expect-error: func is a function
		await func?.();
		console.log = orignalLog;

		assert.strictEqual(logged, 'hi and bye');
	});
});
