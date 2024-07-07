import Transpiler from '@aoi.js/core/Transpiler.js';
import AoiClient from '@aoi.js/classes/AoiClient.js';

import { $cpu } from './$cpu.js';
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
		customFunctions: { $cpu },
		sendMessage: true,
	},
	client,
);

describe('$cpu', () => {
	it('should compile successfully without arg', () => {
		const code =  `${transpiler.mainFunction}[$cpu]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();

		const globalScope = transpiler._createGlobalScope(ast);
		const result = transpiler._compile(ast, [globalScope]);
		expect(result).toBeDefined();

		const func = new Function(`return ${result}`)() as AsyncFunction;
		expect(func).toBeInstanceOf(Function);
	});

	it('should compile successfully with arg', () => {
		const code =  `${transpiler.mainFunction}[$cpu[os]]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();

		const globalScope = transpiler._createGlobalScope(ast);
		const result = transpiler._compile(ast, [globalScope]);
		expect(result).toBeDefined();

		const func = new Function(`return ${result}`)() as AsyncFunction;
		expect(func).toBeInstanceOf(Function);
	});

	it('should fail to compile with invalid arg', () => {
		const code =  `${transpiler.mainFunction}[$cpu[invalid]]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();

		const globalScope = transpiler._createGlobalScope(ast);
		expect(() => transpiler._compile(ast, [globalScope])).toThrow();
	});
});