import Transpiler from '@aoi.js/core/Transpiler.js';
import TestClient from '@aoi.js/testing/testClient.js';

import { $abbreviate } from './$abbreviate.js';
import { type AsyncFunction } from '@aoi.js/typings/type.js';

const client = new TestClient();

const transpiler = new Transpiler(
	{
		client: client,
		scopeData: {
			name: 'global',
			vars: [],
			embeds: [],
			env: [],
			object: {},
			embeddedJS: [],
			sendFunction: 'send',
		},
		customFunctions: { $abbreviate },
		sendMessage: true,
	},
	client,
);

describe('$abbreviate', () => {
	it('should fail to compile successfully without arg', () => {
		const code =  `${transpiler.mainFunction}[$abbreviate]`;
		

		expect(() => transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions))).toThrow();
	});

	it('should compile successfully with arg', () => {
		const code =  `${transpiler.mainFunction}[$abbreviate[10000;2]]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();

		const globalScope = transpiler._createGlobalScope(ast);
		const result = transpiler._compile(ast, [globalScope]);

		expect(result).toBeDefined();

		const func = new Function(`return ${result}`)() as AsyncFunction;
		expect(func).toBeInstanceOf(Function);
	});

	it('should fail to compile with invalid arg', () => {
		const code =  `${transpiler.mainFunction}[$abbreviate[invalid]]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();

		const globalScope = transpiler._createGlobalScope(ast);
		expect(() => transpiler._compile(ast, [globalScope])).toThrow();
	});
});