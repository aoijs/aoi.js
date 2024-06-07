import { type FunctionData } from '../../../typings/interfaces.js';
import {
	escapeResult,
} from '../../../util/transpilerHelpers.js';

export const $userAvatar: FunctionData = {
	name: '$userAvatar',
	type: 'getter',
	brackets: true,
	optional: false,
	fields: [
		{
			name: 'user',
			type: 'bigint',
			description: 'Id of the user',
			required: false,
		},
		{
			name: 'size',
			type: 'number',
			description: 'Size of the avatar',
			required: false,
		}, {
			name: 'dynamic',
			type: 'boolean',
			description: 'Whether the avatar is dynamic',
			required: false,
		}, {
			name: 'format',
			type: 'string',
			description: 'The format of the avatar',
			required: false,
		},
	],
	version: '7.0.0',
	default: [
		'void',
		'1024',
		'true',
		'\'png\'',
	],
	returns: 'string',
	description: 'Returns the avatar of the user',
	example: `
        $userAvatar // returns the avatar of the user

        $userAvatar[123456789012345678n;4096;true;png] // returns the avatar of the user with size 4096, dynamic true and format png
    `,
	code: (data, scope) => {
		const currentScope = scope[scope.length - 1];

		const [id, size = 1024, dynamic = true, format = '\'png\''] = data.splits;

		const avatar = `(await __$DISCORD_DATA$__.bot.util.getUser(${id}))?.avatarUrl({size: ${size}, dynamic: ${dynamic}, format: ${format} }`;

		const res = escapeResult(`${avatar}`);
		currentScope.update(res, data);
		return {
			code: res,
			scope,
		};
	},
};
