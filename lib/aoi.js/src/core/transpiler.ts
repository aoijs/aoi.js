import funcs from '../functions/index.js';
import { type TranspilerOptions } from '../typings/interfaces.js';
import { type MinifyOutput, minify } from 'uglify-js';
import {
	getFunctionList,
	parseResult,
	getFunctionData,
	executeData,
} from '../util/transpilerHelpers.js';
import { TranspilerError } from './error.js';

import fixMath from './parsers/mathParser.js';
import Scope from './structs/Scope.js';
import { type AsyncFunction } from '../typings/types.js';

function generateGlobalScope(
	scopeData: TranspilerOptions['scopeData'],
	client: TranspilerOptions['client'],
): Scope {
	const globalScope = new Scope(
		scopeData?.name ?? 'global',
		client,
		undefined,
	);
	globalScope.addVariables(scopeData?.variables ?? []);
	globalScope.addEmbeds(scopeData?.embeds ?? []);
	globalScope.env.push(...(scopeData?.env ?? []));
	globalScope.objects = { ...globalScope.objects, ...scopeData?.objects };
	globalScope.embededJS = scopeData?.embedJs ?? [];
	globalScope.sendFunction =
		scopeData?.sendFunction ?? globalScope.sendFunction;
	globalScope.useChannel = scopeData?.useChannel;
	return globalScope;
}

export function transpiler(
	code: string,
	options: TranspilerOptions,
): { func: AsyncFunction; code: string; scope: Scope[] } {
	const { scopeData, sendMessage, minify: uglify, customFunctions } = options;
	const functions = { ...funcs, ...customFunctions };
	const functionNames = Object.keys(functions);
	const flist = getFunctionList(code, functionNames);

	flist.forEach((x) => {
		const reg = new RegExp(`${x.replace('$', '\\$')}`, 'gi');
		code = parseResult(code);
		code = code.replace(reg, x);
	});

	const tempcode = `$EXECUTEMAINCODEFUNCTION[
        ${code}
    ]`;
	const fData = getFunctionData(tempcode, '$EXECUTEMAINCODEFUNCTION', flist);
	const globalScope = generateGlobalScope(scopeData, options.client);
	const res = executeData(
		parseResult(code),
		fData.funcs,
		[globalScope],
		options.reverse ?? false,
	);

	if (res.scope[0].sendData.content.trim() !== '') {
		const scope = res.scope[0];
		scope.hasSendData = true;
		// scope.rest = scope.rest.replace(scope.sendData.content.trim(), "");
		scope.rest = scope.replaceLast(
			scope.rest,
			scope.sendData.content.trim(),
			'',
		);
		res.scope[0] = scope;
	}

	res.scope[0].updateEmbedJs();

	let str = res.scope[0].getFunction(sendMessage);
	str = fixMath(str);

	const functionString = uglify ? minify(str) : str;

	if (uglify && (functionString as MinifyOutput).error) {
		throw new TranspilerError(
			`
      Failed To Transpile Code with error ${
	(functionString as MinifyOutput).error?.message
}`,
			{
				code: str,
				cmd: options.command?.name,
				path: options.command?.__path__,
			},
		);
	}

	let func;

	if (options.parsedStringOnly)
		return {
			code: uglify
				? (functionString as MinifyOutput).code
				: (functionString as string),
			func: async () => {
				return undefined;
			},
			scope: res.scope,
		};
	try {
		const strr = uglify
			? (functionString as MinifyOutput).code
			: (functionString as string);
		func = eval(`const f = ${strr}; f`) as AsyncFunction;
	} catch (e) {
		throw new TranspilerError(e as string, {
			code: str,
			cmd: options.command?.name,
			path: options.command?.__path__,
		});
	}

	return { func, ...res };
}
