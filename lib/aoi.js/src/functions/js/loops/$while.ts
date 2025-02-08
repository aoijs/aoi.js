import FunctionBuilder from '@aoi.js/core/builders/Function.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { parseCondition } from '@aoi.js/core/parsers/condition.js';
import Transpiler from '@aoi.js/core/Transpiler.js';
import { ErrorCode, FunctionType, ReturnType } from '@aoi.js/typings/enum.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

const $while = new FunctionBuilder()
	.setName('$while')
	.setBrackets(true)
	.setOptional(false)
	.setType(FunctionType.Scope)
	.setReturns(ReturnType.Void)
	.setFields([
		{
			name: 'condition',
			type: ReturnType.Boolean,
			required: true,
			description: 'Condition to check',
		},
		{
			name: 'code',
			type: ReturnType.Any,
			required: true,
			description: 'Code to execute',
		},
	])
	.setCode((data, scopes, thisArg) => {
		const currentScope = thisArg.getCurrentScope(scopes);
		const [condition, ...code] = thisArg.getParams(data);

		if (!condition && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'`condition` param is required, but missing.',
				data,
			);
		}

		if (!code.length && !thisArg.canSuppressAtComp(data, currentScope)) {
			throw AoijsErrorHandler.FunctionError(
				ErrorCode.MissingParameter,
				'`code` param is required, but missing.',
				data,
			);
		}

		const transpiler = Transpiler.instance!;
		const joined = thisArg.parseData(code.join(';'), ReturnType.Any);		
		const solvedCondition = parseCondition(condition).solve();
		const hash = thisArg.generateHash();
		const { result, scope } = transpiler.transpile(joined, {
			sendMessage: true,
			asFunction: false,
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

		const resultString = thisArg.getResultString(
			() => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore	
				// eslint-disable-next-line no-constant-condition
				while ('$0') {
					// eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/semi
					'$1'
				}
			}, [solvedCondition, result],
		);

		const escaped = escapeResult(resultString);

		return {
			code: escaped,
			scope: scopes,
		};
	})
	.build();

export { $while };