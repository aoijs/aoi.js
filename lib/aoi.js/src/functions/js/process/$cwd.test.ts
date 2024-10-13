import Transpiler from '@aoi.js/core/Transpiler.js';

import { $cwd } from './$cwd.js';
import { type AsyncFunction } from '@aoi.js/typings/type.js';
import TestClient from '@aoi.js/testing/testClient.js';

const client = new TestClient();

const transpiler = new Transpiler(
	{
		customFunctions: { $cwd },
		minify: true,
	},
	client,
);

describe('$cwd', () => {
	it('should compile successfully without arg', () => {
		const code = `${transpiler.mainFunction}[$cwd]`;
		const ast = transpiler._getFunctionData(
			code,
			transpiler.mainFunction,
			Object.keys(transpiler.functions),
		);

		expect(ast).toBeDefined();
		const globalScope = transpiler._createGlobalScope(ast, {
			name: 'global',
			vars: [],
			embeds: [],
			env: [],
			object: {},
			embeddedJS: [],
			sendFunction: 'send',
		});
		const result = transpiler._compile(ast, [globalScope]);
		expect(result).toBeDefined();

		const func = new Function(`return ${result}`)() as AsyncFunction;
		expect(func).toBeInstanceOf(Function);
	});
});
