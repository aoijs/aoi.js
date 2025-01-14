import {
	type ITranspilerOptions,
	type IFunctionData,
	type IScopeData,
	type ICodeFunctionData,
	type ITranspileOptions,
} from '@aoi.js/typings/interface.js';
import Scope from './builders/Scope.js';
import type AoiClient from '@aoi.js/classes/AoiClient.js';
import type Command from '@aoi.js/classes/Command.js';
import {
	ErrorCode,
	FunctionType,
	ReturnType,
	TranspilerCustoms,
} from '@aoi.js/typings/enum.js';
import AoijsErrorHandler from './Error.js';
import * as allFunctions from '@aoi.js/functions/index.js';
import { parseResult } from '@aoi.js/utils/Helpers/core.js';

import { type MinifyOutput, minify } from 'uglify-js';
import { type AsyncFunction } from '@aoi.js/typings/type.js';
import { fixMath } from './parsers/math.js';
import { parseFnBlock } from './parsers/fnblock.js';

export default class Transpiler {
	static instance: Transpiler | undefined = undefined;

	minify!: boolean;
	functions!: Record<string, IFunctionData>;
	client!: AoiClient;
	functionFinderRegex = /(\$[a-z]+)/gi;
	macroFinderRegex = /(#[a-z]+)/gi;
	mainFunction = '$AOIJSMAINFUNCTION';

	constructor(options: ITranspilerOptions, client: AoiClient) {
		if (Transpiler.instance) return Transpiler.instance;

		this.minify = options.minify ?? true;
		this.functions = { ...allFunctions, ...options.customFunctions };
		this.client = client;
		Transpiler.instance = this;
	}

	_createGlobalScope(ast: ICodeFunctionData, scopeData: Partial<IScopeData>) {
		const scope = new Scope(
			scopeData.name ?? 'global',
			this.client,
			undefined,
			ast,
		);

		scope.addVariables(...(scopeData.vars ?? []));
		scope.addEmbeds(scopeData.embeds ?? []);
		scope.env.push(...(scopeData.env ?? []));
		scope.objects = { ...(scope.objects ?? {}), ...scopeData.object };
		scope.embeddedJS = scopeData.embeddedJS ?? [];
		scope.sendFunction = scopeData.sendFunction ?? scope.sendFunction;
		scope.useChannel = scopeData?.useChannel;

		return scope;
	}

	_getFunctionList(code: string, functions: string[]) {
		const raws = code.match(this.functionFinderRegex);
		if (!raws) return [];
		const functionsThatExists = functions.filter((x) =>
			code.toLowerCase().includes(x.toLowerCase()),
		);

		const res = [];

		for (const raw of raws) {
			const func = functionsThatExists.filter(
				(x) => x.toLowerCase() === raw.toLowerCase().slice(0, x.length),
			);
			if (func.length === 1) res.push(func[0]);
			else if (func.length > 1) {
				res.push(func.sort((a, b) => b.length - a.length)[0]);
			} else {
				continue;
			}
		}

		return res;
	}

	_getFunctionData(
		code: string,
		func: string,
		functions: string[],
		command: Command,
	): ICodeFunctionData {
		let funcD: IFunctionData = this.functions[func];
		let codeFuncData: ICodeFunctionData = {
			...funcD,
			total: code,
			inside: undefined,
			splits: () => [],
			funcs: [],
			parsed: '',
			executed: '',
			cmd: command,
		};

		if (func === this.mainFunction) {
			funcD = {
				name: this.mainFunction,
				brackets: true,
				optional: false,
				returns: ReturnType.Void,
				code: (data, scope) => {
					return {
						code: data.executed,
						scope: scope,
					};
				},
				type: FunctionType.Scope,
				fields: [
					{
						name: 'code',
						type: ReturnType.String,
						required: true,
					},
				],
			};

			codeFuncData = {
				...funcD,
				total: code,
				inside: undefined,
				splits: () => [],
				funcs: [],
				parsed: '',
				executed: '',
				cmd: command,
			};
		}

		const regex = new RegExp(`${func.replace('$', '\\$')}`, 'i');
		code = code.replace(regex, func);
		code = code.replaceAll('`', TranspilerCustoms.SL);

		const functionPosition = code.indexOf(func);
		code = code.slice(functionPosition, code.length);

		let leftCount = 0,
			rightCount = 0,
			i = 0;

		let rawTotal = '';

		while (i < code.length) {
			if (!funcD.brackets) break;

			if (!funcD.optional && code[func.length] !== '[') {
				throw AoijsErrorHandler.FunctionError(
					ErrorCode.BracketsRequired,
					'Function requires brackets',
					codeFuncData,
				);
			}

			if (rightCount === leftCount && rightCount !== 0) break;

			if (code[func.length] !== '[') break;

			if (code[i] === '[') leftCount++;
			else if (code[i] === ']') rightCount++;

			rawTotal += code[i];
			i++;
		}

		if (rawTotal === '') rawTotal = func;

		if (
			!this._areBracketsBalanced(rawTotal) &&
			func !== this.mainFunction
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.BracketsMismatch,
				'Brackets are not balanced',
				codeFuncData,
			);
		}

		const funcs = [];
		let inside =
			rawTotal.endsWith(']') && rawTotal.startsWith(`${func}[`)
				? rawTotal.slice(func.length + 1, rawTotal.length - 1)
				: undefined;

		let newinside = inside ?? '';
		const list = this._getFunctionList(inside ?? '', functions);
		functions.splice(0, list.length);

		if (
			(codeFuncData.type !== FunctionType.Scope &&
				codeFuncData.type !== FunctionType.ScopeGetter) ||
			codeFuncData.name === this.mainFunction
		) {
			let idx = 0;
			while (list.length) {
				const func = list.shift()!;

				const funcData = this._getFunctionData(
					newinside,
					func,
					list,
					command,
				);

				inside = inside?.replace(
					funcData.inside?.replaceAll(TranspilerCustoms.FSEP, ';') ??
						'',
					funcData.parsed!,
				);

				newinside = newinside.replace(
					funcData.total,
					`#FUNCTION_${idx++}#`,
				);

				funcData.parent = codeFuncData;

				funcs.push(funcData);
			}
		}

		const parsed = inside?.replaceAll(';', TranspilerCustoms.FSEP) ?? '';
		const executed = newinside.replaceAll(TranspilerCustoms.FSEP, ';');
		codeFuncData.total = rawTotal;
		codeFuncData.inside = inside;
		codeFuncData.splits = () => codeFuncData.executed.split(';');
		codeFuncData.parsed = parsed;
		codeFuncData.executed = executed;
		codeFuncData.funcs = funcs;

		return codeFuncData;
	}

	_areBracketsBalanced(code: string) {
		const leftBracketRegex = /\[/g;
		const rightBracketRegex = /\]/g;

		const leftBrackets = code.match(leftBracketRegex) ?? [];
		const rightBrackets = code.match(rightBracketRegex) ?? [];

		return leftBrackets.length === rightBrackets.length;
	}

	_compile(
		ast: ICodeFunctionData,
		scopes: Scope[],
		reverse = false,
		sendMessage = true,
		asFunction = true,
	) {
		let i = 0;
		while (i < ast.funcs.length) {
			const node = ast.funcs[i];

			if (
				node.type === FunctionType.Scope ||
				node.type === FunctionType.ScopeGetter
			) {
				const executed = node.code(node, scopes);
				node.funcs = [];
				if (node.parent) {
					node.parent.executed = node.parent.executed.replace(
						`#FUNCTION_${i}#`,
						executed.code,
					);
				}

				if (node.type === FunctionType.ScopeGetter) {
					scopes.at(-1)!.content = scopes
						.at(-1)!
						.content.replace(`#FUNCTION_${i}#`, executed.code);

					scopes
						.at(-1)!
						.updateContentParts(`#FUNCTION_${i}#`, executed.code);
				}
			} else {
				if (node.funcs.length) {
					this._compile(
						node,
						scopes,
						reverse,
						sendMessage,
						asFunction,
					);
				}

				const executed = node.code(node, scopes);
				scopes = executed.scope;

				ast.executed = ast.executed.replace(
					`#FUNCTION_${i}#`,
					executed.code,
				);

				if (
					(node.type === FunctionType.Getter ||
						node.type === FunctionType.FunctionGetter) &&
					node.parent?.name === this.mainFunction
				) {
					scopes.at(-1)!.content = scopes
						.at(-1)!
						.content.replace(`#FUNCTION_${i}#`, executed.code);

					scopes
						.at(-1)!
						.updateContentParts(`#FUNCTION_${i}#`, executed.code);
				}
			}

			i++;
		}

		const scope = scopes.at(-1)!;
		if (sendMessage) {
			for (const part of scope._contentParts) {
				if (part.trim() === '') continue;
				ast.executed = ast.executed.replace(part, '');
			}
		}

		if (reverse) {
			ast.executed = parseFnBlock(ast.executed);
		}

		return scope.generate(ast.executed, sendMessage, asFunction);
	}

	_getMacroList(code: string, macros: string[]) {
		const list = code.match(this.macroFinderRegex);
		// get all valid macros
		if (!list) return [];
		const existingMacros = macros.filter((x) =>
			code.toLowerCase().includes(x.toLowerCase()),
		);

		const res = [];

		for (const m of list) {
			const macro = existingMacros.filter(
				(x) => x.toLowerCase() === m.toLowerCase().slice(1, m.length),
			);
			if (macro.length === 1) res.push(macro[0]);
			else if (macro.length > 1) {
				res.push(macro.sort((a, b) => b.length - a.length)[0]);
			} else {
				continue;
			}
		}

		return res;
	}

	transpile(code: string, options: ITranspileOptions) {
		const functions = Object.keys(this.functions);
		const macros = this.client.managers.macros.list();

		const macrosList = this._getMacroList(code, macros);
		// replace All macros with their respective values
		macrosList.forEach((macro) => {
			const reg = new RegExp(`#${macro}`, 'gi');
			code = code.replaceAll(
				reg,
				this.client.managers.macros.get(macro)!.code,
			);
		});

		const functionList = this._getFunctionList(code, functions);

		if (options.asFunction === undefined) {
			options.asFunction = true;
		}

		functionList.forEach((func) => {
			const reg = new RegExp(`${func.replace('$', '\\$')}`, 'gi');
			code = parseResult(code);
			code = code.replace(reg, func);
		});

		const tempCode = `${this.mainFunction}[${code}]`;

		const ast = this._getFunctionData(
			tempCode,
			this.mainFunction,
			functionList,
			options.command,
		);

		const globalScope = this._createGlobalScope(
			ast,
			options.scopeData ?? {},
		);

		let result = this._compile(
			ast,
			[globalScope],
			options.reverse,
			options.sendMessage,
			options.asFunction ?? true,
		);
		result = fixMath(result);
		const functionString = this.minify ? minify(result) : result;

		if (!options.asFunction) {
			// return non minified code
			return { result, ast, scope: globalScope, functionList };
		}

		if (this.minify && (functionString as MinifyOutput).error) {
			throw AoijsErrorHandler.CompilerError(
				ErrorCode.MinificationError,
				`Failed To Transpile Code with error ${
					(functionString as MinifyOutput).error?.message
				}`,
				options.command,
				result,
			);
		}

		let func: AsyncFunction;

		try {
			const minified = this.minify
				? (functionString as MinifyOutput).code
				: (functionString as string);

			func = eval(`const f = ${minified}; f`) as AsyncFunction;
		} catch (e) {
			throw AoijsErrorHandler.CompilerError(
				ErrorCode.FunctionGenerationError,
				e as string,
				options.command,
				result,
			);
		}

		return { func, ast, result, scope: globalScope };
	}

	addFunctions(functions: Record<string, IFunctionData>) {
		this.functions = { ...this.functions, ...functions };
	}
}