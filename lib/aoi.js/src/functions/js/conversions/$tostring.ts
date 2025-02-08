import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import { FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult, safe, safeAsync, safeSync } from '@aoi.js/utils/Helpers/core.js';
import { toString } from '@aoi.js/utils/Helpers/functions.js';

const $tostring = new FunctionBuilder()
	.setName('$tostring')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Getter)
	.setReturns(ReturnType.String)
	.setFields([
		{
			name: 'value',
			type: ReturnType.Any,
			required: true,
			description: 'Value to convert to string',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [value] = thisArg.getParams(data);

		if (!currentScope.hasPkg('UTIL')) {
			currentScope.addPkg('UTIL', 'const UTIL = await import(\'node:util\');');
		}
		
		if (!thisArg.hasFunction(currentScope, toString.name)) {
			thisArg.addFunction(currentScope, toString);
		}

		if (!thisArg.hasFunction(currentScope, safe.name)) {
			thisArg.addFunction(currentScope, safe);
			thisArg.addFunction(currentScope, safeSync);
			thisArg.addFunction(currentScope, safeAsync);
		}



		const escaped = escapeResult(
			thisArg.getResultString(
				() => toString('$0'),
				[value],
			),
		);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $tostring };