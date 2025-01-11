import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $message } from './$message.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $message });

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

const codeToPassWithoutArg = '$message';
const codeToFailWithArg = '$message[hi+bye]';
const codeToPass = '$message[1]';

void describe('$message', () => {
	void it('should compile successfully without arg', () => {
		const { func } = client.transpiler.transpile(
			codeToPassWithoutArg,
			transpilerOptions,
		);
		assert.ok(func);
		assert.strictEqual(typeof func, 'function');
	});

	void it('should not compile successfully with arg', () => {
		// expect this to throw an error
		assert.throws(() => {
			client.transpiler.transpile(codeToFailWithArg, transpilerOptions);
		});
	});

	void it('should compile successfully with arg', () => {
		const { func } = client.transpiler.transpile(
			codeToPass,
			transpilerOptions,
		);
		assert.ok(func);
		assert.strictEqual(typeof func, 'function');
	});
});
