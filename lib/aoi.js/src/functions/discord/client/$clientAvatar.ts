 
import { type Scope } from '../../../index.js';
import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import {
	type TranspiledFuncData,
	type FuncData,
} from '../../../typings/interfaces.js';
import { escapeResult } from '../../../util/transpilerHelpers.js';

const clientAvatar = new AoiJSFunction()
	.setName('$clientAvatar')
	.setType('getter')
	.setBrackets(true)
	.setOptional(true)
	.setFields([
		{
			name: 'size',
			type: 'number',
			description: 'The size of the avatar',
			required: false,
		},
		{
			name: 'format',
			type: 'string',
			description: 'The format of the avatar',
			required: false,
		},
		{
			name: 'dynamic',
			type: 'boolean',
			description: 'Whether the avatar is gif or not',
			required: false,
		},
	])
	.setVersion('7.0.0')
	.setDefault(['void', 'void', 'void'])
	.setReturns('string')
	.setDescription('Returns the Avatar of client')
	.setExample(
		`
$clientAvatar // returns the avatar of client

$clientAvatar[4096;true;png] // returns the avatar of client with size 4096, dynamic true and format png
    `,
	);
clientAvatar.setCode((data: FuncData, scope: Scope[], thisArg) => {
	const [size = '4096', dynamic = 'true', format = 'png'] =
		thisArg.getParams(data);
	const currentScope = thisArg.getCurrentScope(scope);

	const resultString = thisArg.getResultString(
		(discord: TranspiledFuncData) =>
			discord.client.readyData.user.avatarUrl({
				size: '$0' as unknown as number,
				dynamic: '$1' as unknown as boolean,
				format: '$2' as unknown as string,
			}),
		[size, dynamic, `"${format}"`],
	);

	const res = escapeResult(resultString);
	currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, clientAvatar);

export const $clientAvatar = clientAvatar.build();
