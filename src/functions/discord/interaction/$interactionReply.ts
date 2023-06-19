import { Transpiler, TranspilerError, functions } from "../../../index.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
    getFunctionList,
    parseResult,
} from "../../../util/transpilerHelpers.js";
export const $interactionReply: FunctionData = {
    name: "$interactionReply",
    brackets: true,
    optional: false,
    type: "scope",
    fields: [
        {
            name: "msg",
            type: "string",
            description: "The message to send",
            required: true,
        },
        {
            name: "ephemeral",
            type: "boolean",
            description: "Whether the message should be ephemeral or not",
            required: false,
        },
    ],
    description: "replies to the interaction",
    default: ["void", "false"],
    returns: "void",
    version: "7.0.0",
    example: `
        $interactionReply[hello world] // replies with "hello world"

        $interactionReply[hello world;true] // replies with "hello world" and makes it ephemeral

        $interactionReply[
            $title[hello world]
            $description[hello world]
        ;true]
    `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;
        const funcs = [
            ...Object.keys(functions),
            ...currentScope.client.managers.functions.functions.K(),
        ];
        //code here

        const [msg, ephemeral = "false"] = data.splits;

        if (
            !msg &&
            (currentScope?.name.startsWith("$try") ||
                currentScope?.name.startsWith("$catch"))
        )
            throw new TranspilerError(
                `${data.name} requires a message or content`,
            );

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
            newscope.functions = msgExecute.scope[0].functions + "\n";
            newscope.packages = msgExecute.scope[0].packages + "\n";
            newscope.setters = msgExecute.scope[0].setters + "\n";
            newscope.rest = msgExecute.scope[0].rest + "\n";
            newscope.sendData = msgExecute.scope[0].sendData;
            newscope.embeds = msgExecute.scope[0].embeds;
            newscope.components = msgExecute.scope[0].components;
            newscope.files = msgExecute.scope[0].files;
            newscope.stickers = msgExecute.scope[0].stickers;
            newscope.variables = msgExecute.scope[0].variables;
        }
        currentScope.sendFunction = "__$DISCORD_DATA$__.client.createMessage";
        newscope.ephemeral = ephemeral === "true" ? true : false;

        const res = escapeResult(
            `await __$DISCORD_DATA$__.client.createInteractionResponse(__$DISCORD_DATA$__.interaction.id, __$DISCORD_DATA$__.interaction.token, 4, ${newscope.toString(
                false,
            )});`,
        );

        currentScope.update(res, data);

        return {
            code: res,
            scope,
        };
    },
};
