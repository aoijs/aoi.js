import AoiJSFunction from "../../../structures/AoiJSFunction.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";

const guildId = new AoiJSFunction()
    .setName("$guildId")
    .setType("getter")
    .setBrackets(false)
    .setOptional(false)
    .setFields([])
    .setVersion("7.0.0")
    .setDefault([])
    .setReturns("bigint")
    .setDescription("Returns the guildId of current guild")
    .setExample("current guild id is `$guildId`");

guildId.setCode((data, scope, thisArg) => {
    const currentScope = scope[scope.length - 1];

    const guildId = thisArg.getResultString((discord) => discord.guild?.id, []);

    const res = escapeResult(`(${guildId})`);
    currentScope.update(res, data);
    return {
        code: res,
        scope,
    };
}, guildId);

export const $guildId = guildId;
