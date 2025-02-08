import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

const $tonumber = new FunctionBuilder()
	.setName('$tonumber')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Number)
	.setFields([
		{
			name: 'value',
			type: ReturnType.Any,
			required: true,
			description: 'Value to convert to number',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const [value] = thisArg.getParams(data);
		const escaped = escapeResult(
			thisArg.getResultString(
				() => Number('$0'),
				[value],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $tonumber };