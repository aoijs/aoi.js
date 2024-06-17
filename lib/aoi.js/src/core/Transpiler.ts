import {
	type ITranspilerOptions,
	type IFunctionData,
	type IScopeData,
} from '@aoi.js/typings/interface.js';
import Scope from './builders/Scope.js';
import type AoiClient from '@aoi.js/classes/AoiClient.js';
import type Command from '@aoi.js/classes/Command.js';
import { FunctionType, ReturnType, TranspilerCustoms } from '@aoi.js/typings/enum.js';
import { TranspilerError } from './Error.js';

const allFunctions: Record<string, IFunctionData> = {
};

export default class Transpiler {
	scopeData: IScopeData;
	sendMessage: boolean;
	minify: boolean;
	customFunctions: Record<string, IFunctionData>;
	code: string;
	client: AoiClient;

	functionFinderRegex = /(\$[a-z]+)/gi;
	mainFunction = '$AOIJSMAINFUNCTION';

	constructor(code: string, options: ITranspilerOptions, client: AoiClient) {
		this.scopeData = options.scopeData ?? {};
		this.sendMessage = options.sendMessage;
		this.minify = options.minify ?? true;
		this.customFunctions = options.customFunctions;
		this.code = code;
		this.client = client;
	}
	

	_createGlobalScope() {
		const scope = new Scope(
			this.scopeData.name ?? 'global',
			this.client,
			undefined,
			this.code,
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

	getFunctionList(code: string, functions: string[]) {
		const raws = this.functionFinderRegex.exec(code);
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

	getFunctionData( code: string, func: string, functions: string[], command?: Command) {

		let funcD: IFunctionData = allFunctions[func];

		if (func === this.mainFunction) {
			funcD = {
				name: this.mainFunction,
				brackets: true,
				optional: false,
				returns: ReturnType.Void,
				code: (() => { /** Empty */}) as unknown as IFunctionData['code'],
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

		let leftCount = 0, rightCount = 0, i = 0;

		let rawTotal = '';

		while ( i < code.length ) {
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

			if ( rightCount === leftCount && rightCount !== 0) break;

			if (code[func.length] !== '[') break;

			if (code[i] === '[') leftCount++;
			else if (code[i] === ']') rightCount++;

			rawTotal += code[i];
			i++;
		}

		if (rawTotal === '') rawTotal = func;

		if (!this.areBracketsBalanced(rawTotal) && func !== this.mainFunction) { 
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
		let inside = rawTotal.endsWith(']') && rawTotal.startsWith(`${func}[`) ? rawTotal.slice(func.length + 1, rawTotal.length - 1) : undefined;

		const list = this.getFunctionList(inside ?? '', functions);

		functions.splice(0, functions.length);

		let newinside = inside ?? '';

		while (list.length) {
			const func = list.shift()!;

			const funcData = this.getFunctionData(newinside, func, functions, command);

			inside = inside?.replace(
				funcData.inside?.replaceAll(TranspilerCustoms.FSEP, ';') ?? '',
				funcData.parsed,
			); 


		}
	}

	areBracketsBalanced(code: string) {
		const leftBracketRegex = /\[/g;
		const rightBracketRegex = /\]/g;

		const leftBrackets = code.match(leftBracketRegex) ?? [];
		const rightBrackets = code.match(rightBracketRegex) ?? [];

		return leftBrackets.length === rightBrackets.length;
	}
}
