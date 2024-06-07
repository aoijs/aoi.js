import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { escapeResult } from '../../../util/transpilerHelpers.js';

const clientId = new AoiJSFunction()
	.setName('$clientId')
	.setType('getter')
	.setBrackets(false)
	.setOptional(false)
	.setFields([])
	.setVersion('7.0.0')
	.setDefault([])
	.setReturns('bigint')
	.setDescription('Returns the ID of client').setExample(`
$clientId // returns the ID of client
    `);

clientId.setCode((data, scope, thisArg) => {
	const currentScope = thisArg.getCurrentScope(scope);
	const resultString = thisArg.getResultString(
		(discord) => discord.client.user.id,
		[],
	);
	const res = escapeResult(resultString);
	currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, clientId);

export const $clientId = clientId.build();
