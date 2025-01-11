import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $switch } from './$switch.js';
import { $case } from './$case.js';
import { $default } from './$default.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $switch, $case, $default });

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

const codeToFail = '$switch';
const codeToPass = `$switch[1==1;
$case[true;$log[hi]]
$case[false;$log[bye]]
$default[$log[ok]]]`;

void describe('$switch', () => {
	void it('should not compile successfully without arg', () => {
		// expect this to throw an error
		assert.throws(() => {
			client.transpiler.transpile(codeToFail, transpilerOptions);
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
