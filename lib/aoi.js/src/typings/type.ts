import type Scope from '@aoi.js/core/builders/Scope.js';
import { type ITranspilerData, type ICodeFunctionData, type IFunctionData, type IOk, type IErr } from './interface.js';
import type * as Events from '@aoi.js/events/index.js';

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
	| 'debug';
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

export type CustomFunctionProps = IFunctionData & {
	_code?: string;
};

export type Safe<T, E> = IOk<T> | IErr<E>;

export type AoiEventNames = keyof typeof Events;