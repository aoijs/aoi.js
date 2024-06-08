import { type FunctionData } from '../../../typings/interfaces.js';
import {
	escapeResult,
} from '../../../util/transpilerHelpers.js';

export const $authorTag: FunctionData = {
	name: '$authorTag',
	type: 'getter',
	brackets: false,
	optional: false,
	fields: [],
	version: '7.0.0',
	default: [],
	returns: 'string',
	description: 'Returns the tag of the author',
	example: 'author tag is `$authorTag`',
	code: (data, scope) => {
		const currentScope = scope[scope.length - 1];

		const authorTag = '__$DISCORD_DATA$__.author?.tag';

		const res = escapeResult(`(${authorTag})`);
		currentScope.update(res, data);
		return {
			code: res,
			scope,
		};
	},
};
