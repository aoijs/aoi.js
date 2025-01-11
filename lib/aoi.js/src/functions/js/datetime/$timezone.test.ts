import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $timezone } from './$timezone.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $timezone });

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

const codeToPass = '$timezone';
const codeToPassWithArg = '$timezone[UTC]';
const codeToFail = '$timezone[test]';

void describe('$timezone', () => {
	void it('should compile successfully without arg', () => {
		const func = client.transpiler.transpile(codeToPass, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});

	void it('should compile successfully with arg', () => {
		const func = client.transpiler.transpile(
			codeToPassWithArg,
			transpilerOptions,
		);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});

	void it('should fail to compile with invalid arg', () => {
		assert.throws(
			() => client.transpiler.transpile(codeToFail, transpilerOptions),
			Error,
		);
	});

	void it('should return the current timezone', async () => {
		const { func } = client.transpiler.transpile(
			codeToPass,
			transpilerOptions,
		);
		const orignalLog = console.log;
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $timezone.returns);
		};

		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;
		assert.strictEqual(logged, 'UTC');
	});
});
