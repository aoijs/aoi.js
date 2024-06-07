import type StringObject from '../core/structs/StringObject.js';
import {
	type Channel,
	type Client,
	type ClientOptions,
	type GatewayEventNames,
	type GroupConfigOptions,
	type Guild,
	type Interaction,
	type Message,
	type Snowflake,
} from 'zeneth';
import type Scope from '../core/structs/Scope.js';
import {
	type AsyncFunction,
	type CommandTypes,
	type PluginType,
	type AutoFetchDataTypes,
	type AoiClientProps,
} from './types.js';
import { type AoiClient } from '../index.js';
import { type Command } from '../structures/Command.js';

export interface TranspilerOptions {
	customFunctions?: Record<string, FunctionData>;
	sendMessage: boolean;
	scopeData?: {
		variables?: string[];
		embeds?: unknown[];
		name?: string;
		sendFunction?: string;
		functions?: string;
		env?: string[];
		objects?: Record<string, StringObject>;
		embedJs?: string[];
		useChannel?: Snowflake | string;
	};
	reverse?: boolean;
	minify?: boolean;
	parsedStringOnly?: boolean;
	client: AoiClient;
	command?: Command;
}

export interface Field {
	name: string;
	type: string;
	required: boolean;
	description?: string;
}

export interface FunctionData {
	name: string;
	brackets: boolean;
	optional: boolean;
	type: 'scope' | 'setter' | 'getter' | 'function' | 'function_getter' | 'scope_getter';
	fields: Field[];
	returns: unknown;
	default: string[];
	description: string;
	version: string;
	example: string;
	extra?: unknown;
	code: (data: FuncData, scope: Scope[]) => { code: string; scope: Scope[]; data?: FuncData };
}

export interface PartialFunctionData extends FunctionData {
	total: string;
}

export interface FuncData extends FunctionData {
	inside?: string;
	parent?: FunctionData;
	total: string;
	splits: string[];
	funcs: FuncData[];
	parsed: string;
}

export interface CommandData {
	name: string;
	type: CommandTypes;
	code: string;
	__compiled__?: string;
	__uglify__: boolean;
	aliases?: string[];
	__path__?: string;
}

export interface TransformedGuild {
	rulesChannel: { id: string | undefined; name: string | undefined };
	publicUpdatesChannel: { id: string | undefined; name: string | undefined };
	bans: string;
	commands: number;
	partnered: boolean;
	verified: boolean;
	mfaLevel: unknown;
	explicitContentFilter: unknown;
	defaultMessageNotifications: unknown;
	systemChannelFlags: unknown;
	premiumTier: unknown;
	premiumSubscriptionCount: number | undefined;
	preferredLocale: unknown;
	systemChannel: { id: string | undefined; name: string | undefined };
	splash: string | undefined;
	owner: { id: string; name: string; nick: string | undefined };
	icon: string | undefined;
	afkChannel: { id: string | undefined; name: string | undefined };
	membersId: string[];
	channelsId: string[];
	rolesId: string[];
	emojisId: string[];
	stickersId: string[];
}

export interface AoiClientOptions extends ClientOptions {
	events: Array<keyof typeof GatewayEventNames>;
	prefixes: string | string[];
	caches: Record<string, GroupConfigOptions>;
	autoFetchData?: AutoFetchDataTypes[];
}

export interface CommandOptions {
	[key: string]: unknown;
	name: string;
	type: CommandTypes;
	code: string | AsyncFunction;
	aliases?: string[];
	reverseRead?: boolean;
	executeAt?: 'guild' | 'dm' | 'both';
	__path__: string;
}

export interface TranspiledFuncData {
	client: Client;
	bot: AoiClient;
	message?: Message;
	channel?: Channel | { id: Snowflake | undefined; fetched: boolean };
	guild?: Guild | { id: Snowflake | undefined; fetched: boolean };
	author?: Message['author'];
	args?: string[];
	member?: Message['member'];
	interaction?: Interaction;
	data?: unknown;
	command?: Command;
}

export interface Plugin {
	name: string;
	func: (...args: unknown[]) => unknown;
}

export interface Plugins {
	type: PluginType;
	plugins: Plugin[];
}

export interface PluginOptions {
	plugins: Plugins[];
}

export interface AoiClientType extends AoiClient {
	new (options: AoiClientOptions): AoiClient & {
		client: Client;
	} & AoiClientProps;
}