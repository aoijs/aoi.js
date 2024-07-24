import Transpiler from '@aoi.js/core/Transpiler.js';
import AoiClient from '@aoi.js/classes/AoiClient.js';

import { $let } from './$let.js';
import { type AsyncFunction } from '@aoi.js/typings/type.js';

const client = new AoiClient();

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
		customFunctions: { $let },
		sendMessage: true,
	},
	client,
);

describe('$let', () => {

	it('should compile successfully with arg', () => {
		const code =  `${transpiler.mainFunction}[$let[hi;1] $let[hi;hello]]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();

		const globalScope = transpiler._createGlobalScope(ast);
		const result = transpiler._compile(ast, [globalScope]);
		console.log(result);
		expect(result).toBeDefined();

		const func = new Function(`return ${result}`)() as AsyncFunction;
		expect(func).toBeInstanceOf(Function);
	});

	it('should fail to compile without arg', () => {
		const code =  `${transpiler.mainFunction}[$let]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();

		const globalScope = transpiler._createGlobalScope(ast);
		expect(() => transpiler._compile(ast, [globalScope])).toThrow();
	});

	it('should fail to compile with no variable', () => {
		const code =  `${transpiler.mainFunction}[$let[]]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();

		const globalScope = transpiler._createGlobalScope(ast);
		expect(() => transpiler._compile(ast, [globalScope])).toThrow();
	});

	it('should fail to compile with no value', () => {
		const code =  `${transpiler.mainFunction}[$let[hi]]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();

		const globalScope = transpiler._createGlobalScope(ast);
		expect(() => transpiler._compile(ast, [globalScope])).toThrow();
	});
});