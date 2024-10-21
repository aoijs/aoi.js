import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $let } from './$let.js';

const client = new TestClient();
client.transpiler.addFunctions({ $let });

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

const codeToFail = '$let';
const codeToFailWithArg = '$let[hi+bye]';
const codeToPass = '$let[hi;bye]';


void describe('$let', () => {
	void it('should not compile successfully without arg', () => {
		
		// expect this to throw an error
		assert.throws(() => {
			client.transpiler.transpile(codeToFail, transpilerOptions);
		});
	});

	void it('should not compile successfully with arg', () => {
		
		// expect this to throw an error
		assert.throws(() => {
			client.transpiler.transpile(codeToFailWithArg, transpilerOptions);
		});
	});

	void it('should compile successfully with arg', () => {
		const func = client.transpiler.transpile(codeToPass, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});
});
