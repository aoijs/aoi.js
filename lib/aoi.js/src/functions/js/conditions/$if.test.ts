import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $if } from './$if.js';
import { $else } from './$else.js';
import { $elseif } from './$elseif.js';
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';

const client = new TestClient();
client.transpiler.addFunctions({ $if, $else, $elseif });

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

const codeToFail = '$if';
const codeToPass = '$if[1==1 && $ping < 2;$log[hi;bye;ok]] $elseif[2==2;$log[okok]] $else[$log[nono]]';

void describe('$if', () => {
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
