import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { TranspilerError } from '@aoi.js/core/Error.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core';

const $abs = new FunctionBuilder()
	.setName('$abs')
	.setBrackets(true)
	.setOptional(false)
	.setFields([
		{
			name: 'number',
			type: ReturnType.Number,
			required: true,
			description: 'the number to get absolute value',
		},
	])
	.setReturns(ReturnType.Number)
	.setType(FunctionType.Getter)
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);

		const [number] = thisArg.getParams(data);
		const parsedNumber = Number(number);

		if (
			isNaN(parsedNumber) &&
			!thisArg.canSuppressAtComp(data, currentScope)
		) {
			throw TranspilerError.CompileError(
				`Provided number is not a number, received ${number}`,
				data,
			);
		}

		const resultString = thisArg.getResultString(
			() => Math.abs('$0' as unknown as number),
			[parsedNumber.toString()],
		);

		const escaped = escapeResult(resultString);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $abs };
