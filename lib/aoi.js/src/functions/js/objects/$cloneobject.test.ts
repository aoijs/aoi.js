import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $cloneobject } from './$cloneobject.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';
import { ReturnType } from '@aoi.js/typings/enum.js';

const client = new TestClient();
client.transpiler.addFunctions({ $cloneobject });

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

const codeToFail = '$cloneobject';
const codeToPass = `
$createObject[test;{a : 1}]
$cloneobject[test;test2]
$getObject[test2]`;

void describe('$cloneobject', () => {
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

	void it('should compile successfully with arg and output', async () => {
		const { func, result } = client.transpiler.transpile(
			codeToPass,
			transpilerOptions,
		);
		const originalLog = console.log;
		let logged = '';

		console.log = (log: Record<string, string>) => {
			logged = log.content;
		};

		// @ts-expect-error: testing purposes
		await func?.();
		console.log = originalLog;
		assert.deepStrictEqual(client.parseData(logged, ReturnType.Object), {
			a: 1,
		});
	});
});
