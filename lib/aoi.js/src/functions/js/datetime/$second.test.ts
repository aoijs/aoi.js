import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $second } from './$second.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $second });

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

const codeToPass = '$second';

void describe('$second', () => {
	

	void it('should compile successfully without arg', () => {
		const func = client.transpiler.transpile(codeToPass, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});

	void it('should return the current second', async () => {
		const { func } = client.transpiler.transpile(codeToPass, transpilerOptions);
		const orignalLog = console.log;
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $second.returns);
		};

		const cur = new Date().getSeconds();
		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;
		assert.strictEqual(logged, cur);
	});
});
