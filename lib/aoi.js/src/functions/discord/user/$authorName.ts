import { type FunctionData } from '../../../typings/interfaces.js';
import {
	escapeResult,
} from '../../../util/transpilerHelpers.js';

export const $authorName: FunctionData = {
	name: '$authorName',
	type: 'getter',
	brackets: false,
	optional: false,
	fields: [],
	version: '7.0.0',
	default: [],
	returns: 'string',
	description: 'Returns the name of the author',
	example: 'author name is `$authorName`',
	code: (data, scope) => {
		const currentScope = scope[scope.length - 1];

		const authorName = '__$DISCORD_DATA$__.author?.username';

		const res = escapeResult(`(${authorName})`);
		currentScope.update(res, data);
		return {
			code: res,
			scope,
		};
	},
};
