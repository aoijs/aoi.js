import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $guildid } from './$guildid.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $guildid });

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

const codeToPassWithoutArg = '$guildid';
const codeToPassWithArg = '$guildid[hi+bye]';

void describe('$guildid', () => {
	void it('should compile successfully without arg', () => {
		const { func } = client.transpiler.transpile(
			codeToPassWithoutArg,
			transpilerOptions,
		);
		assert.ok(func);
		assert.strictEqual(typeof func, 'function');
	});

	void it('should compile successfully with arg', () => {
		const { func } = client.transpiler.transpile(
			codeToPassWithArg,
			transpilerOptions,
		);
		assert.ok(func);
		assert.strictEqual(typeof func, 'function');
	});
});
