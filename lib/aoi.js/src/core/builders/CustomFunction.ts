import { FunctionType, type ReturnType } from '@aoi.js/typings/enum.js';
import {
	type ITranspileOptions,
	type IFunctionField,
	type ICodeFunctionData,
} from '@aoi.js/typings/interface.js';
import {
	type AsyncFunction,
	type CustomFunctionProps,
	type FunctionCode,
} from '@aoi.js/typings/type.js';
import FunctionBuilder from './Function.js';
import type AoiClient from '@aoi.js/classes/AoiClient.js';
import type Scope from './Scope.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

/**
 * Represents a custom function in Aoi.js that can either be JavaScript or Aoijs.
 */
export default class CustomFunction
	extends FunctionBuilder
	implements CustomFunctionProps {
	declare name: string;
	functionType!: 'js' | 'aoijs';
	brackets = false;
	optional = false;
	declare type: FunctionType;
	declare fields: IFunctionField[];
	declare returns: ReturnType;
	declare code: FunctionCode;
	_code!: undefined | string;

	/**
	 * Sets the function type (either 'js' or 'aoijs').
	 *
	 * @param functionType - The type of the function ('js' or 'aoijs').
	 * @returns The current instance of `CustomFunction`.
	 */
	setFunctionType(functionType: 'js' | 'aoijs'): this {
		this.functionType = functionType;
		return this;
	}

	/**
	 * Sets the code for this custom function.
	 *
	 * @param code - The code to set for this custom function.
	 * @returns The current instance of `CustomFunction`.
	 */
	setCode(code: string | ((data: ICodeFunctionData, scopes: Scope[], thisArg: FunctionBuilder) => {
		code: string;
		scope: Scope[];
	})): this {
		if ( typeof code === 'function' ) {
			this.code = (data: ICodeFunctionData, scopes: Scope[]) => {
				return code(data, scopes, this);
			};

		} else {
			this._code = code;
		}

		return this;
	}

	/**
	 * Creates the custom function and adds it to the client.
	 *
	 * @param client - The Aoi.js client.
	 * @param options - Options for transpiling the code.
	 * @returns The built function object.
	 */
	create(client: AoiClient, options: ITranspileOptions) {
		if (this.functionType === 'js') {
			const build = this.build();
			client.managers.functions.addFunction(this.name, build);
			return build;
		} else {
			const fieldNames = this.fields.map((field) => field.name);

			this.code = this.#setAoijsCodeToJs(client, fieldNames, options);

			const build = {
				name: this.name,
				brackets: this.brackets,
				optional: this.optional,
				type: this.type,
				fields: this.fields,
				returns: this.returns,
				extra: this.extra,
				code: this.code,
			};

			client.managers.functions.addFunction(this.name, build);
			return build;
		}
	}

	/**
	 * Handles the general logic for replacing placeholders, transpiling code, and handling function or result.
	 *
	 * @param client - The Aoi.js client.
	 * @param fieldNames - The names of the fields in the function.
	 * @param options - Options for transpiling the code.
	 * @param scopes - The current scope stack.
	 * @param thisArg - The reference to the current function builder instance.
	 * @param asFunction - Whether the code should be treated as a function.
	 * @param sendMessage - Whether to send a message.
	 * @returns The transpiled code as a string.
	 */
	#handleFunction(
		client: AoiClient,
		fieldNames: string[],
		options: ITranspileOptions,
		scopes: Scope[],
		thisArg: FunctionBuilder,
		asFunction: boolean,
		sendMessage: boolean,
	): FunctionCode {
		return super.setCode((data: ICodeFunctionData) => {
			const params = thisArg.getParams(data);
			const currentScope = thisArg.getCurrentScope(scopes);
			let code = this._code;

			for (let i = 0; i < fieldNames.length; i++) {
				const field = fieldNames[i];
				const value = params[i];
				code = code?.replaceAll(`{${field}}`, value);
			}

			const results = client.transpiler.transpile(code ?? '', {
				...options,
				scopeData: {
					...options.scopeData,
					...currentScope,
					functions: currentScope._funcList,
					name: this.name,
				},
				asFunction,
				sendMessage,
			});

			const func = asFunction ? results.func! : results.result;

			if (asFunction && !thisArg.hasFunction(currentScope, this.name)) {
				thisArg.addFunction(currentScope, func as AsyncFunction);
			}

			const escaped = escapeResult(
				asFunction ? `await ${this.name}(__$DISCORD_DATA$__)` : (func as string),
			);

			return {
				code: escaped,
				scope: scopes,
			};
		}).code;
	}

	/**
	 * Maps Aoijs code to JavaScript for different function types.
	 *
	 * @param client - The Aoi.js client.
	 * @param fieldNames - The field names for the function.
	 * @param options - Options for transpiling the code.
	 * @returns The JavaScript code for the Aoijs function.
	 */
	#setAoijsCodeToJs(
		client: AoiClient,
		fieldNames: string[],
		options: ITranspileOptions,
	): FunctionCode {
		switch (this.type) {
			case FunctionType.Getter:
				return this.#handleFunction(
					client,
					fieldNames,
					options,
					[],
					this,
					false,
					false,
				);
			case FunctionType.Function:
				return this.#handleFunction(
					client,
					fieldNames,
					options,
					[],
					this,
					true,
					true,
				);
			case FunctionType.Setter:
				return this.#handleFunction(
					client,
					fieldNames,
					options,
					[],
					this,
					false,
					false,
				);
			case FunctionType.FunctionGetter:
				return this.#handleFunction(
					client,
					fieldNames,
					options,
					[],
					this,
					true,
					false,
				);
				// TODO: Implement the scope type. currently below are placeholder
			case FunctionType.ScopeGetter:
				return this.#handleFunction(
					client,
					fieldNames,
					options,
					[],
					this,
					false,
					false,
				);
			case FunctionType.Scope:
				return this.#handleFunction(
					client,
					fieldNames,
					options,
					[],
					this,
					true,
					true,
				);
		}
	}
}
