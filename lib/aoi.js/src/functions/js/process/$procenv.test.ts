import Transpiler from '@aoi.js/core/Transpiler.js';
import AoiClient from '@aoi.js/classes/AoiClient.js';

import { $procenv } from './$procenv.js';
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
		customFunctions: { $procenv },
		sendMessage: true,
	},
	client,
);

describe('$procenv', () => {
	it('should compile successfully without arg', () => {
		const code =  `${transpiler.mainFunction}[$procenv]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();

		const globalScope = transpiler._createGlobalScope(ast);
		const result = transpiler._compile(ast, [globalScope]);
		expect(result).toBeDefined();

		const func = new Function(`return ${result}`)() as AsyncFunction;
		expect(func).toBeInstanceOf(Function);
	});

	it('should compile successfully with arg', () => {
		const code =  `${transpiler.mainFunction}[$procenv[PWD]]`;
		const ast = transpiler._getFunctionData(code, transpiler.mainFunction, Object.keys(transpiler.functions));

		expect(ast).toBeDefined();

		const globalScope = transpiler._createGlobalScope(ast);
		const result = transpiler._compile(ast, [globalScope]);
		expect(result).toBeDefined();

		const func = new Function(`return ${result}`)() as AsyncFunction;
		expect(func).toBeInstanceOf(Function);
	});
});