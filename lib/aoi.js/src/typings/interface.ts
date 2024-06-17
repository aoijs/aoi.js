import type AoiClient from '@aoi.js/classes/AoiClient';
import { type ReturnType, type FunctionType } from './enum.js';
import { type CommandTypes, type FunctionCode } from './type.js';
import type StringObject from '../core/builders/StringObject.js';
import type Command from '@aoi.js/classes/Command.js';

export interface ITranspilerOptions {
	customFunctions: Record<string, IFunctionData>;
	sendMessage: boolean;
	client: AoiClient;

	scopeData?: IScopeData;
	reverse?: boolean;
	minify?: boolean;
	parsedStringOnly?: boolean;
	command?: Command;
}

export interface IScopeData {
	vars?: string[];
	embeds?: unknown[];
	name?: string;
	sendFunction?: string;
	functions?: string[];
	env?: string[];
	object?: Record<string, StringObject>;
	embeddedJS?: string[];
	useChannel?: Snowflake | string;
}

export interface IFunctionData {
	name: string;
	brackets: boolean;
	optional: boolean;
	type: FunctionType;
	fields: IFunctionField[];
	returns: ReturnType;
	extra?: unknown;
	code: FunctionCode;
}

export interface ICodeFunctionData extends IFunctionData {
	inside?: string;
	parent?: IFunctionData;
	total: string;
	splits: string[];
	funcs: ICodeFunctionData[];
	parsed: string;
}

export interface IFunctionField {
	name: string;
	type: ReturnType;
	required: boolean;
	deascripton?: string;
}

type Snowflake = bigint;

export interface ICommandOptions {
	[key: string]: unknown;
	name: string;
	type: CommandTypes;
	code: string | (() => Promise<void>);
	aliases?: string[];
	reverseRead?: boolean;
	executeAt?: 'guild' | 'dm' | 'both';
	__path__: string;
}
