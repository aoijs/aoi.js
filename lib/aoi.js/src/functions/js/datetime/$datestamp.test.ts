import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $datestamp } from './$datestamp.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $datestamp });

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

const codeToPass = '$datestamp';

void describe('$datestamp', () => {
	

	void it('should compile successfully without arg', () => {
		const func = client.transpiler.transpile(codeToPass, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});

	void it('should return the current datestamp', async () => {
		const orignalLog = console.log;
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $datestamp.returns);
		};

		const { func } = client.transpiler.transpile(codeToPass, transpilerOptions);

		const cur = new Date().getTime();
		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;
		// check if the datestamp is within 1 second of the current datestamp
		assert.ok(logged as number - cur < 1000);
	});
});
