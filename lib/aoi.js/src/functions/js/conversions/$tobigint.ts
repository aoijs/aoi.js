import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';
import { toBigInt } from '@aoi.js/utils/Helpers/functions.js';

const $tobigint = new FunctionBuilder()
	.setName('$tobigint')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.BigInt)
	.setFields([
		{
			name: 'value',
			type: ReturnType.Any,
			required: true,
			description: 'Value to convert to bigint',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [value] = thisArg.getParams(data);

		if (!thisArg.hasFunction(currentScope, toBigInt.name)) {
			thisArg.addFunction(currentScope, toBigInt);
		}

		const escaped = escapeResult(
			thisArg.getResultString(
				() => toBigInt('$0'),
				[value],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $tobigint };