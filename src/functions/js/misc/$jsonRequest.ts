/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    Scope,
    StringObject,
    Transpiler,
    functions,
    parseStringObject,
} from "../../../index.js";
import AoiJSFunction from "../../../structures/AoiJSFunction.js";
import { funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
    getFunctionList,
} from "../../../util/transpilerHelpers.js";

const jsonRequest = new AoiJSFunction()
    .setName("$jsonRequest")
    .setType("scope_getter")
    .setBrackets(true)
    .setOptional(true)
    .setFields([
        {
            name: "url",
            type: "string",
            description: "The url to request",
            required: true,
        },
        {
            name: "property",
            type: "string",
            description: "The data to access",
            required: false,
        },
        {
            name: "headers",
            type: "json",
            description: "The headers to send",
            required: false,
        },
        {
            name: "error",
            type: "string",
            description: "The error message to send if the request fails",
            required: false,
        },
    ])
    .setVersion("7.0.0")
    .setDefault(["void", "undefined", "{}", "{status}: {error}"])
    .setReturns("string")
    .setDescription("Returns the response of a json GET request")
    .setExample(
        `
        $jsonRequest[https://some-random-api.ml/facts/dog;fact;{};Something went wrong.]
    `
    );
jsonRequest.setCode((data: funcData, scope: Scope[], thisArg) => {
    const [url, prop, headers = "{}", ...errorMsg] = thisArg.getParams(data);
    if (!errorMsg.length) errorMsg.push("");
    const currentScope = thisArg.getCurrentScope(scope);
    let executedErrorMsg;
    const errorMsgFunctionList = getFunctionList(
        errorMsg.join(";"),
        Object.keys(functions)
    );

    const obj = new StringObject("{");
    obj.addEnd("}");

    const parsedObj = parseStringObject(headers, obj);

    const hash = Math.floor(Math.random() * 100000);
    const newscope = new Scope(
        `${data.name}_${hash}`,
        currentScope.client,
        currentScope.name,
        errorMsg.join(";"),
        true
    );
    if (errorMsgFunctionList.length) {
        executedErrorMsg = Transpiler(errorMsg.join(";"), {
            sendMessage: false,
            scopeData: {
                variables: currentScope.variables,
                name: currentScope.name,
                objects: currentScope.objects,
                env: [...currentScope.env, "jsonRequestError"],
            },
            client: currentScope.client,
        });
        newscope.env.push(...executedErrorMsg.scope[0].env);
        newscope.env.push("jsonRequestError");
        newscope.functions = executedErrorMsg.scope[0].functions + "\n";
        newscope.packages = executedErrorMsg.scope[0].packages + "\n";
        newscope.setters = executedErrorMsg.scope[0].setters + "\n";
        newscope.rest = executedErrorMsg.scope[0].rest + "\n";
        newscope.sendData = executedErrorMsg.scope[0].sendData;
        newscope.embeds = executedErrorMsg.scope[0].embeds;
        newscope.components = executedErrorMsg.scope[0].components;
        newscope.files = executedErrorMsg.scope[0].files;
        newscope.stickers = executedErrorMsg.scope[0].stickers;
        newscope.variables = executedErrorMsg.scope[0].variables;
    } else {
        executedErrorMsg = errorMsg.join(";");
        newscope.rest = executedErrorMsg + "\n";
        newscope.sendData.content = executedErrorMsg;
    }
    newscope.addReturn = true;

    const res = escapeResult( prop ? `
        (await fetch(\`${url}\`,{ headers: ${parsedObj.solve()} }).then(res => res.json()).catch((jsonRequestError) => { 
            ${newscope.toString(true)}
        const error = new Error(\`${executedErrorMsg}\`);
        error.component = "jsonRequest";
        error.success = false;
        throw error;
        }))?.${prop}` : `(await fetch(\`${url}\`,{ headers: ${parsedObj.solve()} }).then(res => res.json()).catch((jsonRequestError) => {
            ${newscope.toString(true)}
        const error = new Error(\`${executedErrorMsg}\`);
        error.component = "jsonRequest";
        error.success = false;
        throw error;
        }))
    `);

    currentScope.update(res, data);
    currentScope.functions += newscope.functions;
    currentScope.packages += newscope.packages;
    data.funcs = [];

    return {
        code: res,
        scope,
        data,
    };
}, jsonRequest);

export const $jsonRequest = jsonRequest.build();
