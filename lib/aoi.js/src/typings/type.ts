import type Scope from '@aoi.js/core/builders/Scope.js';
import { type ICodeFunctionData } from './interface.js';

export type FunctionCode = (
	data: ICodeFunctionData,
	scope: Scope[],
) => {
	code: string;
	scope: Scope[];
	data?: ICodeFunctionData;
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
