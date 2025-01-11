import type AoiClient from '@aoi.js/classes/AoiClient.js';
import { type ReturnType, type FunctionType } from './enum.js';
<<<<<<< HEAD
import {
	type AoiEventNames,
	type AsyncFunction,
	type CommandTypes,
	type FunctionCode,
} from './type.js';
import type StringObject from '../core/builders/StringObject.js';
import type Command from '@aoi.js/classes/Command.js';
import {
	type User,
	type Channel,
	type Client,
	type ClientOptions,
	type Guild,
	type Message,
	type GuildMember,
} from 'discord.js';
=======
import { type AoiEventNames, type AsyncFunction, type CommandTypes, type FunctionCode } from './type.js';
import type StringObject from '../core/builders/StringObject.js';
import type Command from '@aoi.js/classes/Command.js';
import { type User, type Channel, type Client, type ClientOptions, type Guild, type Message, type GuildMember } from 'discord.js';
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb

export interface ITranspilerOptions {
	customFunctions: Record<string, IFunctionData>;
	minify: boolean;
}

export interface ITranspileOptions {
	reverse?: boolean;
	parsedStringOnly?: boolean;
<<<<<<< HEAD
	command: Command;
=======
	command?: Command;
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
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
<<<<<<< HEAD
	addReturn?: boolean;
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
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
<<<<<<< HEAD
	cmd: Command;
=======
	cmd?: Command;
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
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
<<<<<<< HEAD
	cache?: Record<string, number | undefined>;
=======
	cache?: Record<string, number | undefined  >;
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
	djsClientOptions?: ClientOptions;
	transpilerOptions?: ITranspilerOptions;
	testMode?: boolean;
}

export interface IAoiLoggerOptions {
	logs?: boolean;
	warnings?: boolean;
	errors?: boolean;
<<<<<<< HEAD
}

export interface IFnBlock {
	text: string;
	children: IFnBlock[];
	parent: IFnBlock | undefined;
}

export interface IOk<T> {
	success: true;
	data: T;
}

export interface IErr<E> {
	success: false;
	error: E;
}

export interface IMacroOptions {
	name: string;
	code: string | AsyncFunction;
}

export interface IDateTimeOptions {
	hour12: boolean;
	timezone: string;
	locale: string;
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
}