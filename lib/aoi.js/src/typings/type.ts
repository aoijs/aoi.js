import type Scope from '@aoi.js/core/builders/Scope.js';
import { type ITranspilerData, type ICodeFunctionData, type ICommandOptions, type IAoiClientOptions, type IFunctionData } from './interface.js';
import { type Client } from 'discord.js';
import { type AoiClientEvents } from './enum.js';
import { type Util } from '@aoi.js/classes/Util.js';
import { type CommandManager } from '@aoi.js/managers/Command.js';
import type FunctionManager from '@aoi.js/managers/Function.js';

export type FunctionCode = (
	data: ICodeFunctionData,
	scope: Scope[],
) => {
	code: string;
	scope: Scope[];
};

export type CommandTypes =
	| 'basic'
	| 'interaction'
	| 'ready'
	| 'debug'
	| 'component';
// export type AsyncFunction = (arg: ITranspiledFuncData) => Promise<unknown>;

export type AutoFetchDataTypes =
	| 'guild'
	| 'channel'
	| 'emoji'
	| 'member'
	| 'role'
	| 'user'
	| 'all';

export type WithBuild<R> = R & { build: () => string };

export type ProxyType<T> =
	T extends Array<infer U>
		? {
			[K in keyof T]: T[K] extends (...args: infer A) => infer R
				? (...args: A) => WithBuild<ProxyType<R>>
				: WithBuild<ProxyType<T[K]>>;
		} & {
			[K in keyof U[]]: U[][K] extends (...args: infer A) => infer R
				? (...args: A) => WithBuild<ProxyType<R>>
				: WithBuild<ProxyType<T[K]>>;
		} & { build: () => string }
		: {
			[K in keyof T]: T[K] extends (...args: infer A) => infer R
				? (...args: A) => WithBuild<ProxyType<R>>
				: WithBuild<ProxyType<T[K]>>;
		} & { build: () => string };

export type AsyncFunction = (arg: ITranspilerData) => Promise<unknown>;

export type OptionalFor<T, K extends keyof T> = {
	[P in keyof T as P extends K ? P : never]?: T[P];
};

export type OptionalExecept<T, K extends keyof T> = {
	[P in keyof T as P extends K ? never : P]: T[P];
};

export type Optional<T, K extends keyof T> = OptionalFor<T, K> &
OptionalExecept<T, K>;

export type AoiClientProps = {
	command: (...cmd: Array<Optional<ICommandOptions, 'type'>>) => void;
} & {
	[key in `${Exclude<CommandTypes, 'basic'>}Command`]: (
		...cmd: Array<Optional<ICommandOptions, 'type'>>
	) => void;
} & {
	client: Client;
	managers: {
		commands: CommandManager;
		functions: FunctionManager;
	};
	options: IAoiClientOptions;
	util: Util;
	__on__: Partial<Record<AoiClientEvents, Array<(...args: unknown[]) => void>>>;
};

export type CustomFunctionProps = IFunctionData & {
	_code?: string;
};