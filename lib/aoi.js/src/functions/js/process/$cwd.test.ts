import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $cwd } from './$cwd.js';

const client = new TestClient();
client.transpiler.addFunctions({ $cwd });

const transpilerOptions = {
	scopeData: {
		name: 'global',
		vars: [],
		embeds: [],
		env: [],
		object: {},
		embeddedJS: [],
		sendFunction: 'console.log',
	},
};

const codeToPassWithoutArg = '$cwd';


void describe('$cwd', () => {
	void it('should compile successfully without arg', () => {
		
		const func = client.transpiler.transpile(codeToPassWithoutArg, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});
});
