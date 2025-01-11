import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $cpu } from './$cpu.js';
<<<<<<< HEAD
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb

const client = new TestClient();
client.transpiler.addFunctions({ $cpu });

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

const codeToPassWithoutArg = '$cpu';
const codeToFailWithArg = '$cpu[hi]';
const codeToPass = '$cpu[os]';


void describe('$cpu', () => {
	void it('should compile successfully without arg', () => {
		
		const func = client.transpiler.transpile(codeToPassWithoutArg, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
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
});
