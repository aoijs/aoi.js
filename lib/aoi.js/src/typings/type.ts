import type Scope from '@aoi.js/core/builders/Scope.js';
import { type ITranspilerData, type ICodeFunctionData } from './interface.js';

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

export type AsyncFunction = (arg: ITranspilerData ) => Promise<unknown>;