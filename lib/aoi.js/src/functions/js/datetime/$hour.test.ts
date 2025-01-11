import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $hour } from './$hour.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $hour });

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

const codeToPass = '$hour';

void describe('$hour', () => {
	

	void it('should compile successfully without arg', () => {
		const func = client.transpiler.transpile(codeToPass, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});

	void it('should return the current hour', async () => {
		const { func } = client.transpiler.transpile(codeToPass, transpilerOptions);
		const orignalLog = console.log;
		let logged: unknown;

		console.log = (log: Record<string, string>) => {
			logged = client.parseData(log.content, $hour.returns);
		};

		const cur = Number(
			Intl.DateTimeFormat('en', {
				hour: 'numeric',
				hour12: false,
				timeZone: 'UTC',
			}).format(new Date()),
		);
		// @ts-expect-error: func is a function
		await func?.();

		console.log = orignalLog;
		assert.strictEqual(logged, cur);
	});
});
