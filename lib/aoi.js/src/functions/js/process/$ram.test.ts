import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $ram } from './$ram.js';

const client = new TestClient();
client.transpiler.addFunctions({ $ram });

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

const codeToPassWithoutArg = '$ram';
const codeToFail = '$ram[hi]';
const codeWithParam = '$ram[rss]';

void describe('$ram', () => {
	void it('should compile successfully without arg', () => {
		
		const func = client.transpiler.transpile(codeToPassWithoutArg, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});

	void it('should not compile successfully with arg', () => {
		
		// expect this to throw an error
		assert.throws(() => {
			client.transpiler.transpile(codeToFail, transpilerOptions);
		});
	});

	void it('should compile successfully with arg', () => {
		const func = client.transpiler.transpile(codeWithParam, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});
});
