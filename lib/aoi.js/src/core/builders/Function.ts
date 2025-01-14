import {
	ReturnType,
	TranspilerCustoms,
	type FunctionType,
} from '@aoi.js/typings/enum.js';
import {
	type IFunctionField,
	type IFunctionData,
	type ICodeFunctionData,
	type ITranspilerData,
} from '@aoi.js/typings/interface.js';
import {
	type ProxyType,
	type FunctionCode,
	type CommandTypes,
} from '@aoi.js/typings/type.js';
import type Scope from './Scope.js';
import { inspect } from 'node:util';
import proxyBuilder from './typeProxy.js';
import { escapeVars } from '@aoi.js/utils/Helpers/core.js';
import type StringObject from './StringObject.js';

export default class FunctionBuilder implements IFunctionData {
	name!: string;
	brackets!: boolean;
	optional!: boolean;
	type!: FunctionType;
	fields!: IFunctionField[];
	returns!: ReturnType;
	extra!: unknown;
	code!: FunctionCode;

	setName(name: string): this {
		this.name = name;
		return this;
	}

	setBrackets(brackets: boolean): this {
		this.brackets = brackets;
		return this;
	}

	setOptional(optional: boolean): this {
		this.optional = optional;
		return this;
	}

	setType(type: FunctionType): this {
		this.type = type;
		return this;
	}

	setFields(fields: IFunctionField[]): this {
		this.fields = fields;
		return this;
	}

	setReturns(returns: ReturnType): this {
		this.returns = returns;
		return this;
	}

	setExtra(extra: unknown): this {
		this.extra = extra;
		return this;
	}

	setCode(
		code: (
			data: ICodeFunctionData,
			scopes: Scope[],
			thisArg: FunctionBuilder,
		) => {
			code: string;
			scope: Scope[];
		},
	): this {
		this.code = (data: ICodeFunctionData, scopes: Scope[]) => {
			return code(data, scopes, this);
		};

		return this;
	}

	build(): IFunctionData {
		return {
			name: this.name,
			brackets: this.brackets,
			optional: this.optional,
			type: this.type,
			fields: this.fields,
			returns: this.returns,
			extra: this.extra,
			code: this.code,
		};
	}

	// Helper functions to be used in the code function

	getCurrentScope(scopes: Scope[]): Scope {
		return scopes[scopes.length - 1];
	}

	getParams(data: ICodeFunctionData): string[] {
		if (data.executed === '') return [];
		return data.fields.length === 1 &&
			!this.#isReturnAnyOrArray(data.fields[0].type)
			? [data.executed]
			: data.splits();
	}

	addFunction(
		scope: Scope,
		func: (...args: any[]) => any,
		vars: string[] = [],
	): void {
		const stringified = func.toString();

		const functionName = inspect(func)
			.replace('[Function: ', '')
			.replace(']', '')
			.trim();

		const es5Regex =
			/^(?:(?:\/\*[^(?:*/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*\s*(?:(?:(?:async\s(?:(?:\/\*[^(?:*/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*\s*)?function|class)(?:\s|(?:(?:\/\*[^(?:*/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*)|(?:[_$\w][\w0-9_$]*\s*(?:\/\*[^(?:*/)]*\*\/\s*)*\s*\()|(?:\[\s*(?:\/\*[^(?:*/)]*\*\/\s*)*\s*(?:(?:['][^']+['])|(?:["][^"]+["]))\s*(?:\/\*[^(?:*/)]*\*\/\s*)*\s*\]\())/;

		const isEs6 = !es5Regex.test(stringified);
		const findNumbersRegex = /\$[0-9]+/g;
		let functionToAdd = '';

		if (isEs6) {
			functionToAdd = `function ${functionName} ${stringified.replace(
				'=>',
				'',
			)}`;
		} else {
			functionToAdd = stringified;
		}

		const numbers = functionToAdd.match(findNumbersRegex);
		if (numbers?.length && vars?.length) {
			for (const number of numbers) {
				const index = parseInt(number.replace('$', ''));
				functionToAdd = functionToAdd
					.replaceAll(`"${number}"`, vars[index])
					.replaceAll(`'${number}'`, vars[index]);
			}
		}

		scope.addFunction(functionToAdd);
	}

	hasFunction(scope: Scope, functionName: string): boolean {
		return scope._funcList.includes(functionName);
	}

	getResultString(
		func: (__$DISCORD_DATA$__: ITranspilerData) => any,
		args: string[] = [],
	): string {
		const body = func.toString();

		const matchWholeArgwithAsync = /(async\s*)?\(?\s*(\w)*\s*\)?(?=\s*=>)/;
		const argRegex = /\(?\s*(\w)*\s*\)?(?=\s*=>)/;

		const getArg = argRegex.exec(body);
		if (!getArg) throw new Error('Function Arg must be present');

		const arg = getArg[0].replace('(', '').replace(')', '').trim();

		let bodyWithoutArg = body.replace(matchWholeArgwithAsync, '');

		// remove all //comments
		bodyWithoutArg = bodyWithoutArg.replace(/\/\/.*/g, '');

		if (arg !== '') {
			bodyWithoutArg = this.#replaceArgInFunctionStringWithVar(
				bodyWithoutArg,
				arg,
			);
		}

		const removedArrow = bodyWithoutArg.replace('=>', '').trim();

		const bodyWithoutBrackets = removedArrow.startsWith('{')
			? removedArrow.slice(1, -1)
			: removedArrow;
		const findNumbersRegex = /\$[0-9]+/g;
		const numbers = bodyWithoutBrackets.match(findNumbersRegex);

		if (!numbers) {
			return bodyWithoutBrackets.trim();
		}

		let result = bodyWithoutBrackets;
		for (const number of numbers) {
			const index = parseInt(number.replace('$', ''));
			result = result
				.replaceAll(`"${number}"`, args[index])
				.replaceAll(`'${number}'`, args[index]);
		}

		return result.trim();
	}

	as<T>(variable: string): ProxyType<T> {
		return proxyBuilder<T>(variable);
	}

	defineVar(name: string, value: string, redefined = false) {
		if (redefined) {
			return `${escapeVars(name)} = ${value};\n`;
		} else {
			return `let ${escapeVars(name)} = ${value};\n`;
		}
	}

	canSuppressAtComp(data: ICodeFunctionData, scope: Scope): boolean {
		if (
			data.executed.startsWith(TranspilerCustoms.FS) ||
			scope.name.startsWith('$try') ||
			scope.name.startsWith('$catch')
		) {
			return true;
		} else {
			return false;
		}
	}

	for(
		start: number,
		end: number,
		incrementFn: number | string,
		code: string,
		variable = 'loop_index',
	) {
		return `for (let ${variable} = ${start}; ${variable} < ${end}; ${incrementFn.toString()}) { ${code} }\n`;
	}

	forOf(variable: string, object: string, code: string): string {
		return `for (const ${variable} of ${object}) { ${code} }\n`;
	}

	forIn(variable: string, object: string, code: string): string {
		return `for (const ${variable} in ${object}) { ${code} }\n`;
	}

	parseData<T extends ReturnType>(data: string, type: T) {
		if (
			data.startsWith(TranspilerCustoms.FS) ||
			data.startsWith(TranspilerCustoms.MFS) ||
			data.includes('__$DISCORD_DATA$__')
		) {
			return data;
		}

		switch (type) {
			case ReturnType.Number:
				return Number(data) as T extends ReturnType.Number
					? number
					: never;
			case ReturnType.Boolean:
				return (data === 'true') as T extends ReturnType.Boolean
					? boolean
					: never;
			default:
				return data;
		}
	}

	isCorrectType(data: string | number | boolean, type: ReturnType): boolean {
		if (
			typeof data === 'string' &&
			(data.startsWith(TranspilerCustoms.FS) ||
				data.startsWith(TranspilerCustoms.MFS) ||
				data.includes('__$DISCORD_DATA$__'))
		) {
			return true;
		}

		if (typeof data === 'string') data = data.trim();

		switch (type) {
			case ReturnType.Number:
				return !isNaN(Number(data));
			case ReturnType.Boolean:
				return data === true || data === false;
			case ReturnType.Array:
				return (
					(data as string).startsWith('[') &&
					(data as string).endsWith(']')
				);
			case ReturnType.Object:
				return (
					(data as string).startsWith('{') &&
					(data as string).endsWith('}')
				);
			default:
				return true;
		}
	}

	getCommand(
		name: string,
		type: CommandTypes,
		extraData?: StringObject,
	): string {
		return this.getResultString(
			async (discordData) =>
				(await discordData.bot.managers.commands[
					'"$1"' as unknown as CommandTypes
				]
					.find((cmd) => cmd.name === '"$0"')
					?.__compiled__({
						...discordData,
						data: '$2' as unknown as Record<string, unknown>,
					})) ?? '',
			[name, type, extraData?.solve() ?? ''],
		);
	}

	generateHash(): string {
		return Math.random().toString(36).substring(7);
	}

	#replaceArgInFunctionStringWithVar(
		func: string,
		arg: string,
		variable = '__$DISCORD_DATA$__',
	): string {
		// it will replace all arg with __$DISCORD_DATA$__ and wont replace same word if it is a part of another word or a property

		const regex = new RegExp(
			`((?<![a-zA-Z0-9_.])|\\.{3})(${arg})(?![a-zA-Z0-9_])`,
			'g',
		);
		return func.replaceAll(regex, (item) => {
			if (item.startsWith('...')) return `...${variable}`;
			return variable;
		});
	}

	// a function to check if return type contains ReturnType.Any or ReturnType.Array
	#isReturnAnyOrArray(returnType: ReturnType): boolean {
		// types are power of 2 that can be or'd together
		return (
			((returnType & ReturnType.Any) as ReturnType) === ReturnType.Any ||
			((returnType & ReturnType.Array) as ReturnType) === ReturnType.Array
		);
	}
}
