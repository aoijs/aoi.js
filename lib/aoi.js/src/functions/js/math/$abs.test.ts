import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $abs } from './$abs.js';

const client = new TestClient();
client.transpiler.addFunctions({ $abs });

const transpilerOptions = {
	scopeData: {
		name: 'global',
		vars: [],
		embeds: [],
		env: [],
		object: {},
		embeddedJS: [],
		sendFunction: 'console.log',
	},
};

const codeToFail = '$abs';
const codeToPass = '$abs[2000]';
const codeWithPositive = '$abs[200]';
const codeWithNegative = '$abs[-200]';


void describe('$abs', () => {
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

	void it('should return 200 for 200', async () => {
		// logs true
		const orignalLog = console.log;
		let logged: Record<string, string> = { content: 'hi' };

		console.log = (log: Record<string, string>) => {
			logged = log;
			// orignalLog(log);
		};

		const { func } = client.transpiler.transpile(codeWithPositive, transpilerOptions);

		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;

		assert.strictEqual(logged.content.toString(), '200');
	});

	void it('should return 200 for -200', async () => {
		// logs false
		const orignalLog = console.log;
		let logged: Record<string, string> = { content: 'hi' };

		console.log = (log: Record<string, string>) => {
			logged = log;
			// orignalLog(log);
		};

		const { func } = client.transpiler.transpile(codeWithNegative, transpilerOptions);

		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;

		assert.strictEqual(logged.content.toString(), -200);
	});
});
