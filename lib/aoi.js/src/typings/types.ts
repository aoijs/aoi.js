import { type Client, type Cacher } from 'zeneth';
import { type CommandManager } from '../manager/Command.js';
import { type FunctionManager } from '../manager/Function.js';
import { type Util } from '../structures/Util.js';
import {
	type AoiClientOptions,
	type CommandOptions,
	type Plugin,
	type TranspiledFuncData,
} from './interfaces.js';
import { type AoiClientEvents } from './enums.js';

export type CommandTypes =
	| 'basic'
	| 'interaction'
	| 'ready'
	| 'debug'
	| 'component';

export type CommandMethods = CommandTypes extends 'basic'
	? 'command'
	: `${Exclude<CommandTypes, 'basic'>}Command` | 'command';
export type AsyncFunction = (arg: TranspiledFuncData) => Promise<unknown>;

export type AutoFetchDataTypes =
	| 'guild'
	| 'channel'
	| 'emoji'
	| 'member'
	| 'role'
	| 'user'
	| 'all';

// make provided key as optional
export type OptionalFor<T, K extends keyof T> = {
	[P in keyof T as P extends K ? P : never]?: T[P];
};

export type OptionalExecept<T, K extends keyof T> = {
	[P in keyof T as P extends K ? never : P]: T[P];
};

export type Optional<T, K extends keyof T> = OptionalFor<T, K> &
OptionalExecept<T, K>;
// change basiCommand to command

export type DynamicAoiClientMethods = {
	[key in `${Exclude<CommandTypes, 'basic'>}Command` | 'command']: (
		...cmd: Array<Optional<CommandOptions, 'type'>>
	) => void;
};

export type AoiClientProps = DynamicAoiClientMethods & {
	client: Client;
	managers: {
		commands: CommandManager;
		functions: FunctionManager;
	};
	options: AoiClientOptions;
	cache?: Cacher;
	util: Util;
	__on__: Partial<
	Record<AoiClientEvents, Array<(...args: unknown[]) => void>>
	>;
};

export type PluginType =
	| 'pre'
	| 'post'
	| 'load'
	| 'preEvent'
	| 'postEvent'
	| 'preCommand'
	| 'postCommand';

export type PluginManagerProps = {
	[key in PluginType]: Plugin[];
};
