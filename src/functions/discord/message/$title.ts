import { RawEmbedData } from "zeneth";
import { parseString } from "../../../core/parsers/stringParser.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import { escapeResult, escapeVars } from "../../../util/transpilerHelpers.js";
export const $title: FunctionData = {
    name: "$title",
    brackets: true,
    optional: false,
    type: "setter",
    fields: [
        {
            name: "index or title",
            type: "string | number",
            description: "The index of the embed to set the title of",
            required: true,
        },
        {
            name: "title",
            type: "string",
            description: "The title to set",
            required: false,
        },
    ],
    description: "Sets the title of an embed at the specified index",
    default: ["text", ""],
    returns: "void",
    version: "7.0.0",
    example: `
        $title[hello world] // sets the title of the first embed to "hello world"

        $title[2;hello world] // sets the title of the second embed to "hello world"
    `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;
        //code here
        const [indexOrTitle, ...title] = data.splits;
        const parsedTitle = title.join(";");
        let actualTitle: string;
        let index = 0;
        if (!parsedTitle) actualTitle = indexOrTitle;
        else if (parsedTitle && isNaN(Number(indexOrTitle)))
            actualTitle = indexOrTitle + ";" + parsedTitle;
        else {
            actualTitle = parsedTitle;
            index = Number(indexOrTitle) - 1;
        }

        let embed = currentScope.embeds[index] as RawEmbedData;
        if (!embed) {
            embed = {
                fields: [],
            };

            currentScope.setters += escapeResult(
<<<<<<< HEAD
                `${escapeVars(`${currentScope.name}_embeds`)}[${index}] = { fields: [] };`
=======
                `${escapeVars(
                    currentScope.name + "_embeds",
                )}[${index}] = { fields: [] };`,
>>>>>>> d679aa85ca16eee7375524de8ce607c9ee85db14
            );
        }

        embed.title = actualTitle;
        currentScope.embeds[index] = embed;

        const res = escapeResult(
<<<<<<< HEAD
            `${escapeVars(`${currentScope.name}_embeds`)}[${index}].title = ${parseString(actualTitle)};`
=======
            `${escapeVars(
                currentScope.name + "_embeds",
            )}[${index}].title = ${parseString(actualTitle)};`,
>>>>>>> d679aa85ca16eee7375524de8ce607c9ee85db14
        );

        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
