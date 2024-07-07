import {
	type ITranspilerOptions,
	type IFunctionData,
	type IScopeData,
	type ICodeFunctionData,
} from '@aoi.js/typings/interface.js';
import Scope from './builders/Scope.js';
import type AoiClient from '@aoi.js/classes/AoiClient.js';
import type Command from '@aoi.js/classes/Command.js';
import {
	FunctionType,
	ReturnType,
	TranspilerCustoms,
} from '@aoi.js/typings/enum.js';
import { TranspilerError } from './Error.js';
import { parseString } from './parsers/string.js';

const allFunctions: Record<string, IFunctionData> = {
	$ping: {
		name: '$ping',
		brackets: false,
		optional: false,
		returns: ReturnType.Number,
		code: (data, scopes) => {
			return {
				code: 'ping',
				scope: scopes,
			};
		},
		type: FunctionType.Getter,
		fields: [],
	},
	$title: {
		name: '$title',
		brackets: true,
		optional: false,
		returns: ReturnType.String,
		code: (data, scopes) => {
			const text = data.executed;
			return { 
				code: 'title(' + parseString(text) + ')',
				scope: scopes,
			};
		},
		type: FunctionType.Setter,
		fields: [
			{
				name: 'text',
				type: ReturnType.String,
				required: true,
			},
		],
	},
	$let: {
		name: '$let',
		brackets: true,
		optional: false,
		returns: ReturnType.Void,
		code: (data, scopes) => {
			const [name, value] = data.splits();
			return {
				code: `let ${name} = ${value};`,
				scope: scopes,
			};
		},
		type: FunctionType.Setter,
		fields: [
			{
				name: 'text',
				type: ReturnType.String,
				required: true,
			},
		],
	},
	$wait: {
		name: '$wait',
		brackets: true,
		optional: false,
		returns: ReturnType.Void,
		code: (data, scopes) => {
			const [time] = data.splits();
			return {
				code: `await new Promise((r) => setTimeout(r, ${time}))`,
				scope: scopes,
			};
		},
		type: FunctionType.Setter,
		fields: [
			{
				name: 'time',
				type: ReturnType.Number,
				required: true,
			},
		],
	},
};

export default class Transpiler {

	static instance: Transpiler | undefined = undefined;

	scopeData!: IScopeData;
	sendMessage!: boolean;
	minify!: boolean;
	functions!: Record<string, IFunctionData>;
	client!: AoiClient;

	functionFinderRegex = /(\$[a-z]+)/gi;
	mainFunction = '$AOIJSMAINFUNCTION';

	constructor( options: ITranspilerOptions, client: AoiClient) {

		if (Transpiler.instance) return Transpiler.instance;
		this.scopeData = options.scopeData ?? {};
		this.sendMessage = options.sendMessage;
		this.minify = options.minify ?? true;
		this.functions = { ...allFunctions, ...options.customFunctions };
		this.client = client;
		Transpiler.instance = this;

	}

	_createGlobalScope(ast: ICodeFunctionData) {
		const scope = new Scope(
			this.scopeData.name ?? 'global',
			this.client,
			undefined,
			ast,
		);

		scope.addVariables(this.scopeData.vars ?? []);
		scope.addEmbeds(this.scopeData.embeds ?? []);
		scope.env.push(...(this.scopeData.env ?? []));
		scope.objects = { ...scope.objects, ...this.scopeData.object };
		scope.embeddedJS = this.scopeData.embeddedJS ?? [];
		scope.sendFunction = this.scopeData.sendFunction ?? scope.sendFunction;
		scope.useChannel = this.scopeData?.useChannel;

		return scope;
	}

	_getFunctionList(code: string, functions: string[]) {
		// eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
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
		command?: Command,
	): ICodeFunctionData {
		let funcD: IFunctionData = this.functions[func];

		const codeFuncData: ICodeFunctionData = {
			...funcD,
			total: code,
			inside: undefined,
			splits: () => [],
			funcs: [],
			parsed: '',
			executed: '',
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
				throw new TranspilerError('Function requires brackets', {
					function: {
						name: func,
						code: func,
					},
					cmd: command?.name,
					path: command?.__path__,
				});
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
			throw new TranspilerError('Brackets are not balanced', {
				function: {
					name: func,
					code: rawTotal,
				},
				cmd: command?.name,
				path: command?.__path__,
			});
		}

		const funcs = [];
		let inside =
			rawTotal.endsWith(']') && rawTotal.startsWith(`${func}[`)
				? rawTotal.slice(func.length + 1, rawTotal.length - 1)
				: undefined;

		const list = this._getFunctionList(inside ?? '', functions);
		functions.splice(0, list.length);

		let newinside = inside ?? '';
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
				funcData.inside?.replaceAll(TranspilerCustoms.FSEP, ';') ?? '',
				funcData.parsed!,
			);

			newinside = newinside.replace(
				funcData.total,
				`#FUNCTION_${idx++}#`,
			);

			funcData.parent = codeFuncData;

			funcs.push(funcData);
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

	_compile(ast: ICodeFunctionData, scopes: Scope[], reverse = false) {
		if (reverse) {
			ast.funcs = ast.funcs.reverse();
		}

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
					
					scopes.at(-1)!.updateContentParts(`#FUNCTION_${i}#`, executed.code);
				}
			} else {
				if (node.funcs.length) {
					this._compile(node, scopes, reverse);
				}

				const executed = node.code(node, scopes);
				scopes = executed.scope;

				ast.executed = ast.executed.replace(
					`#FUNCTION_${i}#`,
					executed.code,
				);

				if (
					node.type === FunctionType.Getter ||
					node.type === FunctionType.FunctionGetter
				) {
					scopes.at(-1)!.content = scopes
						.at(-1)!
						.content.replace(`#FUNCTION_${i}#`, executed.code);
					
					scopes.at(-1)!.updateContentParts(`#FUNCTION_${i}#`, executed.code);
				}
			}

			i++;
		}

		const scope = scopes.at(-1)!;
		for (const part of scope._contentParts) {
			ast.executed = ast.executed.replace(part, '');
		}

		return scope.generate(ast.executed);
	}

	// updateEmbedJs() {
	// 	const embeds = [...this.embeddedJS.reverse()];
	// 	for (const embed of embeds) {
	// 		const old = this.rest;
	// 		this.rest = this.replaceLast(this.rest, BundlerCustoms.EJS, embed);
	// 		if (this.rest === old) {
	// 			this.packages = this.embeddedJS.shift() + '\n' + this.packages;
	// 		} else {
	// 			this.embeddedJS.shift();
	// 		}
	// 	}
	// }
}