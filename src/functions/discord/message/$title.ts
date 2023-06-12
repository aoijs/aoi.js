import { RawEmbedData } from "aoiluna";
import { parseString } from "../../../core/parsers/stringParser.js";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
    escapeVars,
} from "../../../util/transpilerHelpers.js";
export const $title: FunctionData = {
    name: "$title",
    brackets: true,
    optional: false,
    type: "setter",
    fields: [
        {
            name: "index or title",
            type: "string | number",
            required: true,
        },
        {
            name: "title",
            type: "string",
            required: false,
        },
    ],
    description: "Sets the title of an embed at the specified index",
    default: ["text", ""],
    returns: "void",
    version: "7.0.0",
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;
        //code here
        const [ indexOrTitle,...title] = data.splits;
        const parsedTitle = title.join(";");
        let actualTitle:string;
        let index = 0;
        if(!parsedTitle) actualTitle = indexOrTitle;
        else if(parsedTitle && isNaN(Number(indexOrTitle))) actualTitle = indexOrTitle+";"+parsedTitle;
        else {
            actualTitle = parsedTitle;
            index = Number(indexOrTitle)-1;
        }

        let embed = currentScope.embeds[index] as RawEmbedData;
        if(!embed) {
            embed = {
                fields: [],
            };

            currentScope.setters += escapeResult(
                `${escapeVars(currentScope.name)}_embeds[${index}] = { fields: [] };`
            );
        }

        embed.title = actualTitle;
        currentScope.embeds[index] = embed;

        const res = escapeResult(
            `${escapeVars(currentScope.name)}_embeds[${index}].title = ${parseString(actualTitle)};`
        );

        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
