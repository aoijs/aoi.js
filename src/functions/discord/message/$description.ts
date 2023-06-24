import { RawEmbedData } from "zeneth";
import { parseString } from "../../../core/parsers/stringParser.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import { escapeResult, escapeVars } from "../../../util/transpilerHelpers.js";
export const $description: FunctionData = {
    name: "$description",
    brackets: true,
    optional: false,
    type: "setter",
    fields: [
        {
            name: "index or description",
            type: "string | number",
            description: "The index of the embed to set the description of",
            required: true,
        },
        {
            name: "description",
            type: "string",
            description: "The description to set",
            required: false,
        },
    ],
    description: "Sets the description of an embed at the specified index",
    default: ["text", ""],
    returns: "void",
    version: "7.0.0",
    example: `
        $description[hello world] // sets the description of the first embed to "hello world"

        $description[2;hello world] // sets the description of the second embed to "hello world"
    `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;
        //code here
        const [indexOrDescription, ...description] = data.splits;
        const parsedDescription = description.join(";");
        let actualDescription: string;
        let index = 0;
        if (!parsedDescription) actualDescription = indexOrDescription;
        else if (parsedDescription && isNaN(Number(indexOrDescription)))
            actualDescription = indexOrDescription + ";" + parsedDescription;
        else {
            actualDescription = parsedDescription;
            index = Number(indexOrDescription) - 1;
        }

        let embed = currentScope.embeds[index] as RawEmbedData;
        if (!embed) {
            embed = {
                fields: [],
            };

            currentScope.setters += escapeResult(
                `${escapeVars(
                    currentScope.name,
                )}_embeds[${index}] = { fields: [] };`,
            );
        }

        embed.description = actualDescription;
        currentScope.embeds[index] = embed;

        const res = escapeResult(
            `${escapeVars(
                currentScope.name,
            )}_embeds[${index}].description = ${parseString(
                actualDescription,
            )};`,
        );

        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
