import AoiJSFunction from "../../../structures/AoiJSFunction.js";
import { escapeResult } from "../../../util/transpilerHelpers.js";

const clientToken = new AoiJSFunction()
    .setName("$clientToken")
    .setType("getter")
    .setBrackets(false)
    .setOptional(false)
    .setFields([])
    .setVersion("7.0.0")
    .setDefault([])
    .setReturns("string")
    .setDescription("Returns the token of client")
    .setExample("client token is `$clientToken`");

clientToken.setCode((data, scope, thisArg) => {
    const currentScope = thisArg.getCurrentScope(scope);
    const resultString = thisArg.getResultString(
        (discord) => discord.client.token,
        [],
    );
    const res = escapeResult(resultString as string);
    currentScope.update(res, data);

    return {
        code: res,
        scope,
    };
}, clientToken);

export const $clientToken = clientToken.build();
