import { type ICodeFunctionData } from '@aoi.js/typings/interface.js';

export class TranspilerError extends Error {

	static CompileError(msg: string, data: ICodeFunctionData) {
		return new TranspilerError(`CompileError: ${msg}`, {
			function: {
				name: data.name,
				code: data.inside ?? '',
			},
			cmd: data.cmd?.name,
			path: data.cmd?.__path__,
			code: data.cmd?.code.toString(),
		});
	}

	static RunTimeError(msg: string, data: ICodeFunctionData) {
		return new TranspilerError(`RunTimeError: ${msg}`, {
			function: {
				name: data.name,
				code: data.inside ?? '',
			},
			cmd: data.cmd?.name,
			path: data.cmd?.__path__,
			code: data.cmd?.code.toString(),
		});
	}

	static AoiReaderError(msg: string, code: string) {
		return new TranspilerError(`AoiReaderError: ${msg}`, {
			code,
		});
	}

	function?: { name: string; code: string };
	cmd?: string;
	path?: string;
	code: string | undefined;
	constructor(
		msg: string,
		data?: {
			function?: {
				name: string;
				code: string;
			};
			cmd?: string;
			path?: string;
			code?: string;
		},
	) {
		super(msg);
		this.name = 'TranspilerError';
		// this.cause = this;
		this.function = data?.function;
		this.cmd = data?.cmd;
		this.path = data?.path;
		this.code = data?.code;
	}

	toString() {
		return `[TranspilerError]|> ${this.message} {
${
	this.function
		? `function: {
    name: ${this.function.name}
    code: ${this.function.code.trim()}
}`
		: ''
}${this.cmd ? `cmd: ${this.cmd}` : ''}${
	this.path ? `path: ${this.path}` : ''
}${this.code ? `code: ${this.code}` : ''}
}`;
	}
}
