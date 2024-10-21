import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $procenv } from './$procenv.js';

const client = new TestClient();
client.transpiler.addFunctions({ $procenv });

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

const codeToPassWithoutArg = '$procenv';
const codeToPassWithArg = '$procenv[hi]';


void describe('$procenv', () => {
	void it('should compile successfully without arg', () => {
		
		const func = client.transpiler.transpile(codeToPassWithoutArg, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});

	void it('should compile successfully with arg', () => {
		
		const func = client.transpiler.transpile(codeToPassWithArg, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});
});
