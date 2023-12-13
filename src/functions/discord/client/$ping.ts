import AoiJSFunction from "../../../structures/AoiJSFunction.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";

const ping = new AoiJSFunction()
    .setName("$ping")
    .setType("getter")
    .setBrackets(false)
    .setOptional(false)
    .setFields([])
    .setVersion("7.0.0")
    .setDefault([])
    .setReturns("number")
    .setDescription("Returns the Ping of client")
    .setExample("client ping is `$pingms`");

ping.setCode((data, scope, thisArg) => {
    const currentScope = thisArg.getCurrentScope(scope);
    const resultString = thisArg.getResultString(
        (discord) => discord.client.ws.data.ping,
        [],
    );
    const res = escapeResult(resultString as string);
    currentScope.update(res, data);

    return {
        code: res,
        scope,
    };
}, ping);

export const $ping = ping.build();
