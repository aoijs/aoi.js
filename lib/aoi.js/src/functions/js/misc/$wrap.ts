import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import type { AsyncFunction } from '@aoi.js/typings/type.js';
import { DISCORD_DATA } from '@aoi.js/utils/Constants/functions.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import { wrap } from '@aoi.js/utils/Helpers/functions.js';

/**
 * Wraps the code in a function and returns the value state of the code or the error state if it fails.
 * @example
 * ```aoi
 * ---
 * name: wrap
 * type: basic
 * ---
 * 
 * $wrap[false; $return[Hello World!]] // \{ status: true, data: 'Hello World!' \}
 * $wrap[false; $throw[Hello World!]] // \{ status: false, error: Error \}
 * ```
 */
const $wrap = new FunctionBuilder()
	.setName('$wrap')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.ScopeGetter)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'sendMessage',
			type: ReturnType.Boolean,
			required: true,
			description: 'Whether the output should be sent as a message.',
		},
		{
			name: 'code',
			type: ReturnType.String,
			required: true,
			description:
				'The code to wrap. this function returns the value state of the code or the error state if it fails.',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [sendMessage, ...code] = thisArg.getParams(data);

		const parsedSendMessage = sendMessage === 'true';
		const joined = thisArg.parseData(code.join(';'), ReturnType.String);

		if (
			!thisArg.isCorrectType(parsedSendMessage, ReturnType.Boolean) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.InvalidArgumentType,
				`Invalid argument type 'sendMessage' in function $wrap, got ${sendMessage}, expected ReturnType.${ReturnType[ReturnType.Boolean]} `,
				data,
			);
		}

		const transpiler = Transpiler.instance!;
		const hash = thisArg.generateHash();

		const { func, scope } = transpiler.transpile(joined, {
			sendMessage: parsedSendMessage,
			asFunction: true,
			scopeData: {
				vars: currentScope.variables,
				name: `${data.name}_${hash}`,
				object: currentScope.objects,
				env: currentScope.env,
			},
			reverse: data.cmd?.reverseRead ?? false,
			command: data.cmd,
		});

		currentScope.functions += scope.functions + '\n';
		currentScope.packages += scope.packages + '\n';

		if (!thisArg.hasFunction(currentScope, wrap.name)) {
			thisArg.addFunction(currentScope, wrap);
		}

		if (!thisArg.hasFunction(currentScope, func!.name)) {
			thisArg.addFunction(currentScope, func!);
		}

		const escaped = escapeResult(
			thisArg.getResultString(
				// eslint-disable-next-line @typescript-eslint/return-await
				async () => await wrap('$0' as unknown as Promise<unknown>),
				[`${func?.name}(${DISCORD_DATA})`],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $wrap };
