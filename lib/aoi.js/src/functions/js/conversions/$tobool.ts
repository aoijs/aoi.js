import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

const $tobool = new FunctionBuilder()
	.setName('$tobool')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.Boolean)
	.setFields([
		{
			name: 'value',
			type: ReturnType.Any,
			required: true,
			description: 'Value to convert to boolean',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const [value] = thisArg.getParams(data);
		const escaped = escapeResult(
			thisArg.getResultString(
				() => Boolean('$0'),
				[value],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $tobool };