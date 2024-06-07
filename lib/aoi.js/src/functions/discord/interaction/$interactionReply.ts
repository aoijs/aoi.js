/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Transpiler, TranspilerError, functions } from '../../../index.js';
import Scope from '../../../core/structs/Scope.js';
import {
	escapeResult,
	getFunctionList,
	parseResult,
} from '../../../util/transpilerHelpers.js';
import AoiJSFunction from '../../../structures/AoiJSFunction.js';
import { InteractionResponseTypes, type Snowflake } from 'zeneth';

const interactionReply = new AoiJSFunction()
	.setName('$interactionReply')
	.setType('scope')
	.setBrackets(true)
	.setOptional(false)
	.setFields([
		{
			name: 'msg',
			type: 'string',
			description: 'The message to send',
			required: true,
		},
		{
			name: 'ephemeral',
			type: 'boolean',
			description: 'Whether the message should be ephemeral or not',
			required: false,
		},
	])
	.setVersion('7.0.0')
	.setDefault(['void', 'false'])
	.setReturns('void')
	.setDescription('replies to the interaction').setExample(`
        $interactionReply[hello world] // replies with "hello world"

        $interactionReply[hello world;true] // replies with "hello world" and makes it ephemeral

        $interactionReply[
            $title[hello world]
            $description[hello world]
        ;true]
    `);

interactionReply.setCode((data, scope, thisArg) => {
	const currentScope = thisArg.getCurrentScope(scope);
	const funcs = [
		...Object.keys(functions),
		...currentScope.client.managers.functions.functions.K(),
	];
	//code here

	const [msg, ephemeral = 'false'] = thisArg.getParams(data);

	if (
		!msg &&
        (currentScope?.name.startsWith('$try') ||
            currentScope?.name.startsWith('$catch'))
	)
		throw new TranspilerError(`${data.name} requires a message or content`);

	let msgExecute;
	const msgFunctionList = getFunctionList(msg, funcs);
	const hash = Math.floor(Math.random() * 1000000);
	const newscope = new Scope(
		`${data.name}_${hash}`,
		currentScope.client,
		currentScope.name,
		parseResult(msg),
		false,
	);
	if (msgFunctionList.length) {
		msgExecute = Transpiler(msg, {
			client: currentScope.client,
			customFunctions:
                currentScope.client.managers.functions.functions.toJSON(),
			sendMessage: false,
			scopeData: {
				variables: currentScope.variables,
				embeds: currentScope.embeds,
				name: newscope.name,
				objects: currentScope.objects,
			},
		});
		newscope.functions = msgExecute.scope[0].functions + '\n';
		newscope.packages = msgExecute.scope[0].packages + '\n';
		newscope.setters = msgExecute.scope[0].setters + '\n';
		newscope.rest = msgExecute.scope[0].rest + '\n';
		newscope.sendData = msgExecute.scope[0].sendData;
		newscope.embeds = msgExecute.scope[0].embeds;
		newscope.components = msgExecute.scope[0].components;
		newscope.files = msgExecute.scope[0].files;
		newscope.stickers = msgExecute.scope[0].stickers;
		newscope.variables = msgExecute.scope[0].variables;
	}

	currentScope.sendFunction = thisArg.getResultString(
		(discord) => discord.client.createMessage,
		[],
	);

	newscope.ephemeral = ephemeral === 'true';

	const resultString = thisArg.getResultString(
		async (discord) =>
			discord.client.createInteractionResponse(
				discord.interaction?.id!,
				discord.interaction?.token!,
				//@ts-expect-error
				'$0',
				'$1',
			),
		[
			InteractionResponseTypes.ChannelMessageWithSource,
			newscope.toString(false),
		],
	);

	const res = escapeResult(resultString);
	currentScope.update(res, data);

	return {
		code: res,
		scope,
	};
}, interactionReply);

export const $interactionReply = interactionReply.build();
