// import { type ICodeFunctionData } from '@aoi.js/typings/interface.js';

// export class TranspilerError extends Error {

// 	static CompileError(msg: string, data: ICodeFunctionData) {
// 		return new TranspilerError(`CompileError: ${msg}`, {
// 			function: {
// 				name: data.name,
// 				code: data.inside ?? '',
// 			},
// 			cmd: data.cmd?.name,
// 			path: data.cmd?.__path__,
// 			code: data.cmd?.code.toString(),
// 		});
// 	}

// 	static RunTimeError(msg: string, data: ICodeFunctionData) {
// 		return new TranspilerError(`RunTimeError: ${msg}`, {
// 			function: {
// 				name: data.name,
// 				code: data.inside ?? '',
// 			},
// 			cmd: data.cmd?.name,
// 			path: data.cmd?.__path__,
// 			code: data.cmd?.code.toString(),
// 		});
// 	}

// 	static AoiReaderError(msg: string, code: string) {
// 		return new TranspilerError(`AoiReaderError: ${msg}`, {
// 			code,
// 		});
// 	}

// 	function?: { name: string; code: string };
// 	cmd?: string;
// 	path?: string;
// 	code: string | undefined;
// 	constructor(
// 		msg: string,
// 		data?: {
// 			function?: {
// 				name: string;
// 				code: string;
// 			};
// 			cmd?: string;
// 			path?: string;
// 			code?: string;
// 		},
// 	) {
// 		super(msg);
// 		this.name = 'TranspilerError';
// 		// this.cause = this;
// 		this.function = data?.function;
// 		this.cmd = data?.cmd;
// 		this.path = data?.path;
// 		this.code = data?.code;
// 	}

// 	toString() {
// 		return `[TranspilerError]|> ${this.message} {
// ${
// 	this.function
// 		? `function: {
//     name: ${this.function.name}
//     code: ${this.function.code.trim()}
// }`
// 		: ''
// }${this.cmd ? `cmd: ${this.cmd}` : ''}${
// 	this.path ? `path: ${this.path}` : ''
// }${this.code ? `code: ${this.code}` : ''}
// }`;
// 	}
// }

import type Command from '@aoi.js/classes/Command.js';
import type Macro from '@aoi.js/classes/Macro.js';
import { AoiErrorType, ErrorCode } from '@aoi.js/typings/enum.js';
import type {
	ICodeFunctionData,
	ICommandOptions,
	IMacroOptions,
} from '@aoi.js/typings/interface.js';

export default class AoijsErrorHandler extends Error {
	static FunctionError = (
		errorCode: ErrorCode,
		message: string,
		data: ICodeFunctionData,
	) => {
		const err = new AoijsErrorHandler(
			AoiErrorType.FunctionError,
			errorCode,
			message,
		);
		err.function = data.name;
		err.cmd = data.cmd?.name;
		err.code = data.cmd?.code.toString();
		return err;
	};

	static CompilerError = (
		errorCode: ErrorCode,
		message: string,
		cmd?: Command,
		transpiledCode?: string,
	) => {
		const err = new AoijsErrorHandler(
			AoiErrorType.CompilerError,
			errorCode,
			message,
		);
		err.cmd = cmd?.name;
		err.code = cmd?.code.toString();
		if (transpiledCode) err.code = transpiledCode;
		return err;
	};

	static ReaderError = (
		errorCode: ErrorCode,
		message: string,
		code: string,
	) => {
		const err = new AoijsErrorHandler(
			AoiErrorType.ReaderError,
			errorCode,
			message,
		);
		err.code = code;
		return err;
	};

	static CommandError = (
		errorCode: ErrorCode,
		message: string,
		cmd: Command | ICommandOptions,
	) => {
		const err = new AoijsErrorHandler(
			AoiErrorType.CommandError,
			errorCode,
			message,
		);
		err.cmd = cmd.name;
		err.code = cmd.code.toString();
		return err;
	};

	static MacroError = (
		errorCode: ErrorCode,
		message: string,
		macro: Macro | IMacroOptions,
	) => {
		const err = new AoijsErrorHandler(
			AoiErrorType.MacroError,
			errorCode,
			message,
		);
		err.cmd = macro.name;
		err.code = macro.code.toString();
		return err;
	};

	errorCode: keyof typeof ErrorCode;
	function?: string;
	code?: string;
	cmd?: string;
	constructor(type: AoiErrorType, errorCode: ErrorCode, message: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
		this.errorCode = this.#getErrorCode(errorCode);
		this.name = this.#getErrorType(type);

		Error.captureStackTrace(this, this.constructor); // keep stack trace clean
	}

	#getErrorType(type: AoiErrorType) {
		return AoiErrorType[type];
	}

	#getErrorCode(code: ErrorCode) {
		return ErrorCode[code] as keyof typeof ErrorCode;
	}
}