import {
	type FunctionData,
	type funcData,
	Scope,
	TranspilerError,
	Transpiler,
} from '../../../index.js';
import funcs from '../../index.js';
import {
	getFunctionList,
	escapeResult,
} from '../../../util/transpilerHelpers.js';

export const $default: FunctionData = {
	name: '$default',
	brackets: true,
	optional: false,
	type: 'scope',
	fields: [
		{
			name: 'code',
			type: 'string',
			description: 'The code to execute if the default case is true',
			required: true,
		},
	],
	version: '7.0.0',
	default: ['void', 'void'],
	returns: 'void',
	description: 'Default case statement',
	example: `
        $let[num;1]
    $switch[$get[num];
        $case[1;
            $log[hello world]
        ]
        $case[2;
            $log[hello world 2]
        ]
        $default[
            $log[hello world default]
        ]
    ]`,
	code: (data: funcData, scope: Scope[]) => {
		const splits = data.splits;
		const currentScope = scope[scope.length - 1];
		if ($default.brackets) {
			if (
				!data.total.startsWith($default.name + '[') &&
                (!currentScope.name.startsWith('$try_') ||
                    !currentScope.name.startsWith('$catch_'))
			) {
				throw new TranspilerError(
					`${data.name} requires closure brackets`,
				);
			}
		}

		const errorMsg = splits;

		const hash = Math.floor(Math.random() * 100000);
		const newscope = new Scope(
			`${data.name}_${hash}`,
			currentScope.client,
			currentScope.name,
			errorMsg.join(';'),
			true,
		);

		let executedErrorMsg;
		const errorMsgFunctionList = getFunctionList(
			errorMsg.join(';'),
			Object.keys(funcs),
		);
		if (errorMsgFunctionList.length) {
			executedErrorMsg = Transpiler(errorMsg.join(';'), {
				sendMessage: true,
				scopeData: {
					variables: currentScope.variables,
					embeds: currentScope.embeds,
					name: currentScope.name,
					objects: currentScope.objects,
					env: currentScope.env,
				},
				client: currentScope.client,
				minify: true,
			});
			newscope.functions = executedErrorMsg.scope[0].functions + '\n';
			newscope.packages = executedErrorMsg.scope[0].packages + '\n';
			newscope.setters = executedErrorMsg.scope[0].setters + '\n';
			executedErrorMsg.scope[0].addReturn = true;
			newscope.rest = executedErrorMsg.scope[0].rest + '\n';
			newscope.sendData = executedErrorMsg.scope[0].sendData;
		} else {
			executedErrorMsg = errorMsg.join(';');
			newscope.rest = executedErrorMsg + '\n';
			newscope.sendData.content = executedErrorMsg;
		}

		const res = escapeResult(`
    default:
      ${newscope.toString()}
      break;
    `);
		currentScope.update( res, data );
		return {
			code: res,
			scope: scope,
			data,
		};
	},
};
