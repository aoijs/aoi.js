import Transpiler from '@aoi.js/core/Transpiler.js';
import AoiClient from '@aoi.js/classes/AoiClient.js';

import { $ram } from '@aoi.js/functions/js/process/$ram.js';
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
		customFunctions: { $ram },
		sendMessage: true,
	},
	client,
);

describe('$ram', () => {
	it('should compile successfully without arg', () => {
		const code =  `${transpiler.mainFunction}[$ram]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();
		const globalScope = transpiler._createGlobalScope(ast);
		const result = transpiler._compile(ast, [globalScope]);
		expect(result).toBeDefined();

		const func = new Function(`return ${result}`)() as AsyncFunction;
		expect(func).toBeInstanceOf(Function);
	});

	it('should compile successfully with arg', () => {
		const code =  `${transpiler.mainFunction}[$ram[rss]]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();
		const globalScope = transpiler._createGlobalScope(ast);
		const result = transpiler._compile(ast, [globalScope]);
		expect(result).toBeDefined();

		const func = new Function(`return ${result}`)() as AsyncFunction;
		expect(func).toBeInstanceOf(Function);
	});

	it('should fail to compile with invalid arg', () => {
		const code =  `${transpiler.mainFunction}[$ram[invalid]]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();
		const globalScope = transpiler._createGlobalScope(ast);

		// transpiler._compile(ast, [globalScope]); will throw an error
		expect(() => transpiler._compile(ast, [globalScope])).toThrow();
	});
});