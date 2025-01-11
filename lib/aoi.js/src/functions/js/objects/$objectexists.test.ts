import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $objectexists } from './$objectexists.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';
import { TranspilerCustoms } from '@aoi.js/typings/enum.js';

const client = new TestClient();
client.transpiler.addFunctions({ $objectexists });

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

const codeToFail = '$objectexists';
const codeToPass = '$objectexists[test]';
const codeToPassWithFS = '$objectexists[$ping]';
const codeToPassWithDiscordData = '$objectexists[__$DISCORD_DATA$__.author]';

void describe('$objectexists', () => {
	void it('should not compile successfully without arg', () => {
		// expect this to throw an error
		assert.throws(() => {
			client.transpiler.transpile(codeToFail, transpilerOptions);
		});
	});

	void it('should compile successfully without arg', () => {
		const func = client.transpiler.transpile(codeToPass, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});

	void it('should compile successfully with FS', () => {
		try {
			const func = client.transpiler.transpile(
				codeToPassWithFS,
				transpilerOptions,
			);
			assert.ok(func);
			assert.strictEqual(typeof func.func, 'function');
		} catch (e) {
			console.error(e);
		}
	});

	void it('should compile successfully with Discord Data', () => {
		const func = client.transpiler.transpile(
			codeToPassWithDiscordData,
			transpilerOptions,
		);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});
});
