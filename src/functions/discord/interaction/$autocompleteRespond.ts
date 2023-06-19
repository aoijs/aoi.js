import Scope from "../../../core/structs/Scope.js";
import { StringObject, parseStringObject } from "../../../index.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";
export const $autocompleteRespond: FunctionData = {
    name: "$autocompleteRespond",
    brackets: true,
    optional: true,
    type: "setter",
    fields: [
        {
            name: "options",
            type: "array  | object",
            description: "The options to respond with",
            required: true,
        },
    ],
    description:
        "responds to the autocomplete interaction with the provided options",
    default: ["void"],
    returns: "void",
    version: "7.0.0",
    example: `
        $autocompleteRespond[{
            name: "Hello World",
            value: "helloworld"
        };{
            name: "Hello World 2",
            value: "helloworld2"
        }] // responds to the autocomplete interaction with the provided options (object)

        $autocompleteRespond[Hello World;helloworld;Hello World 2;helloworld2] // responds to the autocomplete interaction with the provided options (array)
    `,
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;
        //code here

        const [...opts] = data.splits;

        const options = [];
        let i = 0;
        while(i < opts.length) {
            const opt = opts[i].trim();
            if(opt.startsWith("{") && opt.endsWith("}")) {
                const currentObj =  new StringObject("{");
                currentObj.addEnd("}");

                const obj = parseStringObject(opt, currentObj);
                options.push(obj.solve());
                i += 1;
            }
            else {
                const name = opt;
                const value = opts[i + 1];
                options.push(`{name: "${name}", value: "${value}" }`);
                i += 2;
            }
        }

        const res = escapeResult(
            `await __$DISCORD_DATA$__.client.createInteractionResponse(__$DISCORD_DATA$__.interaction.id, __$DISCORD_DATA$__.interaction.token,8,{
                    choices: [${options.join(",\n")}]
                });`,
        );

        currentScope.update(res, data);

        return {
            code: res,
            scope,
        };
    },
};
