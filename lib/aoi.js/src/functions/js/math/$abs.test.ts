import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $abs } from './$abs.js';
<<<<<<< HEAD
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb

const client = new TestClient();
client.transpiler.addFunctions({ $abs });

<<<<<<< HEAD
const transpilerOptions: ITranspileOptions = {
=======
const transpilerOptions = {
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	scopeData: {
		name: 'global',
		vars: [],
		embeds: [],
		env: [],
		object: {},
		embeddedJS: [],
		sendFunction: 'console.log',
	},
<<<<<<< HEAD
	command: new TestCommand(client),
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
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
<<<<<<< HEAD
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $abs.returns);
=======
		let logged: Record<string, string> = { content: 'hi' };

		console.log = (log: Record<string, string>) => {
			logged = log;
			// orignalLog(log);
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
		};

		const { func } = client.transpiler.transpile(codeWithPositive, transpilerOptions);

		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;

<<<<<<< HEAD
		assert.strictEqual(logged, 200);
=======
		assert.strictEqual(logged.content.toString(), '200');
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	});

	void it('should return 200 for -200', async () => {
		// logs false
		const orignalLog = console.log;
<<<<<<< HEAD
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $abs.returns);
=======
		let logged: Record<string, string> = { content: 'hi' };

		console.log = (log: Record<string, string>) => {
			logged = log;
			// orignalLog(log);
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
		};

		const { func } = client.transpiler.transpile(codeWithNegative, transpilerOptions);

		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;

<<<<<<< HEAD
		assert.strictEqual(logged, 200);
=======
		assert.strictEqual(logged.content.toString(), -200);
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	});
});
