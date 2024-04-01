import AoiJSFunction from "../../../structures/AoiJSFunction.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";

const clientPrefixes = new AoiJSFunction()
    .setName("$clientPrefixes")
    .setType("getter")
    .setBrackets(false)
    .setOptional(false)
    .setFields([])
    .setVersion("7.0.0")
    .setDefault([])
    .setReturns("string")
    .setDescription("Returns the Prefixes of client").setExample(`
$clientPrefixes // returns the Prefixes of client
    `);

clientPrefixes.setCode((data, scope, thisArg) => {
    const currentScope = thisArg.getCurrentScope(scope);
    const resultString = thisArg.getResultString(
        (discord) =>
            Array.isArray(discord.bot.options.prefixes)
                ? discord.bot.options.prefixes.join(", ")
                : discord.bot.options.prefixes,
        [],
    );
    const res = escapeResult(resultString as string);
    currentScope.update(res, data);

    return {
        code: res,
        scope,
    };
}, clientPrefixes);

export const $clientPrefixes = clientPrefixes.build();
