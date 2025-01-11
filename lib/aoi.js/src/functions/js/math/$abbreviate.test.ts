import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $abbreviate } from './$abbreviate.js';
<<<<<<< HEAD
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb

const client = new TestClient();
client.transpiler.addFunctions({ $abbreviate });

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

const codeToFail = '$abbreviate';
const codeToPass = '$abbreviate[2000]';
const codeToValue = '$abbreviate[2000]';
const codeToValueWithDecimal = '$abbreviate[2000;0]';


void describe('$abbreviate', () => {
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

	void it('should return 2.00K', async () => {
		// logs true
		const orignalLog = console.log;
<<<<<<< HEAD
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $abbreviate.returns);
=======
		let logged: Record<string, string> = { content: 'hi' };

		console.log = (log: Record<string, string>) => {
			logged = log;
			// orignalLog(log);
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
		};

		const { func } = client.transpiler.transpile(codeToValue, transpilerOptions);

		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;

<<<<<<< HEAD
		assert.strictEqual(logged, '2.00K');
=======
		assert.strictEqual(logged.content.toString(), '2.00K');
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	});

	void it('should return 2K', async () => {
		// logs false
		const orignalLog = console.log;
<<<<<<< HEAD
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $abbreviate.returns);
=======
		let logged: Record<string, string> = { content: 'hi' };

		console.log = (log: Record<string, string>) => {
			logged = log;
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
			// orignalLog(log);
		};

		const { func } = client.transpiler.transpile(codeToValueWithDecimal, transpilerOptions);

		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;

<<<<<<< HEAD
		assert.strictEqual(logged, '2K');
=======
		assert.strictEqual(logged.content.toString(), '2K');
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	});
});
