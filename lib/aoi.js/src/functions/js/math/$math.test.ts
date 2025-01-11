import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $math } from './$math.js';
<<<<<<< HEAD
import TestCommand from '@aoi.js/testing/testCommand.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb

const client = new TestClient();
client.transpiler.addFunctions({ $math });

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

const codeToFail = '$math';
const codeToFailWithArg = '$math[hi+bye]';
const codeToPass = '$math[2000+1]';
const codewithBasicMath = '$math[2000/2+2-2*2]';
const codeWithAdvMath = '$math[pow(sin(90), 2) + pow(cos(90), 2)]';


void describe('$math', () => {
	void it('should not compile successfully without arg', () => {

		// expect this to throw an error
		assert.throws(() => {
			client.transpiler.transpile(codeToFail, transpilerOptions);
		});
	});

	void it('should not compile successfully with arg', () => {
		
		// expect this to throw an error
		assert.throws(() => {
			client.transpiler.transpile(codeToFailWithArg, transpilerOptions);
		});
	});

	void it('should compile successfully with arg', () => {
		const func = client.transpiler.transpile(codeToPass, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});

	void it('should return 998 for 2000/2+2-2*2', async () => {
		// logs true
		const orignalLog = console.log;
<<<<<<< HEAD
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $math.returns);
=======
		let logged: Record<string, string> = { content: 'hi' };

		console.log = (log: Record<string, string>) => {
			logged = log;
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
			// orignalLog(log);
		};

		const { func } = client.transpiler.transpile(codewithBasicMath, transpilerOptions);

		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;

<<<<<<< HEAD
		assert.strictEqual(logged, 998);
=======
		assert.strictEqual(logged.content.toString(), '998');
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	});

	void it('should return 1 for pow(sin(90), 2) + pow(cos(90), 2)', async () => {
		// logs false
		const orignalLog = console.log;
<<<<<<< HEAD
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $math.returns);
=======
		let logged: Record<string, string> = { content: 'hi' };

		console.log = (log: Record<string, string>) => {
			logged = log;
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
			// orignalLog(log);
		};

		const { func } = client.transpiler.transpile(codeWithAdvMath, transpilerOptions);

		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;

<<<<<<< HEAD
		assert.strictEqual(logged, 1);
=======
		assert.strictEqual(logged.content.toString(), '1');
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	});
});
