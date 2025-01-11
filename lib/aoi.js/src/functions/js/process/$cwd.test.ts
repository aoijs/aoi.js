import { describe, it } from 'node:test';
import assert from 'node:assert';

import TestClient from '@aoi.js/testing/testClient.js';
import { $cwd } from './$cwd.js';
<<<<<<< HEAD
import type { ITranspileOptions } from '@aoi.js/typings/interface.js';
import TestCommand from '@aoi.js/testing/testCommand.js';
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb

const client = new TestClient();
client.transpiler.addFunctions({ $cwd });

<<<<<<< HEAD
const transpilerOptions: ITranspileOptions = {
=======
const transpilerOptions = {
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	scopeData: {
		name: 'global',
		vars: [],
		embeds: [],
		env: [],
		object: {},
		embeddedJS: [],
		sendFunction: 'console.log',
	},
<<<<<<< HEAD
	command: new TestCommand(client),
};
=======
};

>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
const codeToPassWithoutArg = '$cwd';


void describe('$cwd', () => {
	void it('should compile successfully without arg', () => {
		
		const func = client.transpiler.transpile(codeToPassWithoutArg, transpilerOptions);
		assert.ok(func);
		assert.strictEqual(typeof func.func, 'function');
	});
});
