import Transpiler from '@aoi.js/core/Transpiler.js';

import { $and } from './$and.js';
import { type AsyncFunction } from '@aoi.js/typings/type.js';
import TestClient from '@aoi.js/testing/testClient.js';

const client = new TestClient();

const transpiler = new Transpiler(
	{
		customFunctions: { $and },
		minify: true,
	},
	client,
);

describe('$and', () => {
	it('should compile successfully without arg', () => {
		const code = `${transpiler.mainFunction}[$and]`;

		const func = transpiler.transpile(code, {
			'scopeData': {
				name: 'global',
				vars: [],
				embeds: [],
				env: [],
				object: {},
				embeddedJS: [],
				sendFunction: 'send',
			},
		});
		expect(func).toBeDefined();
		expect(func.func).toBeDefined();
		expect(func.func).toBeInstanceOf(Function);
		
		// const ast = transpiler._getFunctionData(
		// 	code,
		// 	transpiler.mainFunction,
		// 	Object.keys(transpiler.functions),
		// );

		// expect(ast).toBeDefined();
		// const globalScope = transpiler._createGlobalScope(ast, {
		// 	name: 'global',
		// 	vars: [],
		// 	embeds: [],
		// 	env: [],
		// 	object: {},
		// 	embeddedJS: [],
		// 	sendFunction: 'send',
		// });
		// const result = transpiler._compile(ast, [globalScope]);
		// expect(result).toBeDefined();

		// const func = new Function(`return ${result}`)() as AsyncFunction;
		// expect(func).toBeInstanceOf(Function);
	});
});
