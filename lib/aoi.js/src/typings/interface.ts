import type AoiClient from '@aoi.js/classes/AoiClient.js';
import { type ReturnType, type FunctionType } from './enum.js';
import { type AoiEventNames, type AsyncFunction, type CommandTypes, type FunctionCode } from './type.js';
import type StringObject from '../core/builders/StringObject.js';
import type Command from '@aoi.js/classes/Command.js';
import { type User, type Channel, type Client, type ClientOptions, type Guild, type Message, type GuildMember } from 'discord.js';

export interface ITranspilerOptions {
	customFunctions: Record<string, IFunctionData>;
	minify: boolean;
}

export interface ITranspileOptions {
	reverse?: boolean;
	parsedStringOnly?: boolean;
	command?: Command;
	sendMessage?: boolean;
	scopeData?: IScopeData;
	asFunction?: boolean;
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
	parent?: ICodeFunctionData;
	total: string;
	splits: () => string[];
	funcs: ICodeFunctionData[];
	parsed?: string;
	executed: string;
	cmd?: Command;
}

export interface IFunctionField {
	name: string;
	type: ReturnType;
	required: boolean;
	description?: string;
}

type Snowflake = bigint;

export interface ICommandOptions {
	[key: string]: unknown;
	name: string;
	type: CommandTypes;
	code: string | AsyncFunction;
	aliases?: string[];
	reverseRead?: boolean;
	executeAt?: 'guild' | 'dm' | 'both';
	__path__: string;
}

export interface ITranspilerData {
	bot: AoiClient;
	client: Client;
	message?: Message;
	guild?: Guild;
	channel?: Channel;
	author?: User;
	member?: GuildMember;
	command: Command;
	args?: string[];
	data?: Record<string, unknown>;
}

export interface IAoiClientOptions {
	token: `${string}.${string}.${string}`;
	intents: number;
	events: AoiEventNames[];
	prefix: string | string[];
	respond?: {
		toBot?: boolean;
		onEdit?: {
			commands?: boolean;
			alwaysExecute?: boolean;
			nonPrefixed?: boolean;
			time?: number;
		};
	};
	cache?: Record<string, number | undefined  >;
	djsClientOptions?: ClientOptions;
	transpilerOptions?: ITranspilerOptions;
	testMode?: boolean;
}

export interface IAoiLoggerOptions {
	logs?: boolean;
	warnings?: boolean;
	errors?: boolean;
}