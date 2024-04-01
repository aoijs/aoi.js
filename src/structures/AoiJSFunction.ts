/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionData, Scope, TranspiledFuncData, funcData } from "../index.js";
import { inspect } from "util";

export default class AoiJSFunction {
    name!: string;
    type!: FunctionData["type"];
    brackets!: boolean;
    optional!: boolean;
    fields!: FunctionData["fields"];
    version!: string;
    default!: string[];
    returns!: string;
    description!: string;
    example!: string;
    code!: FunctionData["code"];
    setName(name: string) {
        this.name = name;
        return this;
    }
    setType(type: FunctionData["type"]) {
        this.type = type;
        return this;
    }
    setBrackets(brackets: boolean) {
        this.brackets = brackets;
        return this;
    }
    setOptional(optional: boolean) {
        this.optional = optional;
        return this;
    }
    setFields(fields: FunctionData["fields"]) {
        this.fields = fields;
        return this;
    }
    setVersion(version: string) {
        this.version = version;
        return this;
    }
    setDefault(defaults: string[]) {
        this.default = defaults;
        return this;
    }
    setReturns(returns: string) {
        this.returns = returns;
        return this;
    }
    setDescription(description: string) {
        this.description = description;
        return this;
    }
    setExample(example: string) {
        this.example = example;
        return this;
    }
    setCode(
        code: (
      data: funcData,
      scope: Scope[],
      thisArg: AoiJSFunction
    ) => { code: string; scope: Scope[]; data?: funcData },
        thisArg: AoiJSFunction
    ) {
        this.code = function (data, scope) {
            return code(data, scope, thisArg);
        };
        return this;
    }
    getCurrentScope(scope: Scope[]) {
        return scope[scope.length - 1];
    }
    getParams(data: funcData) {
        return data.splits;
    }

    setSetter(scope: Scope, value: string) {
        scope.setters = value;
    }

    updateSetter(scope: Scope, value: string) {
        scope.setters += value;
    }
    updateFunction(
        scope: Scope,
        func: (discord: TranspiledFuncData, arg?: unknown[]) => unknown,
        vars?: unknown[]
    ) {
        const stringifyFunction = func.toString();
        const functionName = inspect(func)
            .replace("[Function:", "")
            .replace("]", "")
            .trim();

        const es5Regex =
      /^(?:(?:\/\*[^(?:*/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*\s*(?:(?:(?:async\s(?:(?:\/\*[^(?:*/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*\s*)?function|class)(?:\s|(?:(?:\/\*[^(?:*/)]*\*\/\s*)|(?:\/\/[^\r\n]*))*)|(?:[_$\w][\w0-9_$]*\s*(?:\/\*[^(?:*/)]*\*\/\s*)*\s*\()|(?:\[\s*(?:\/\*[^(?:*/)]*\*\/\s*)*\s*(?:(?:['][^']+['])|(?:["][^"]+["]))\s*(?:\/\*[^(?:*/)]*\*\/\s*)*\s*\]\())/;

        const isEs6 = !es5Regex.test(stringifyFunction);
        const findNumbersRegex = /\$[0-9]+/g;
        let functionToUpdate = "";
        if (isEs6) {
            functionToUpdate = `function ${functionName} ${stringifyFunction.replace(
                "=>",
                ""
            )}`;
        } else {
            functionToUpdate = stringifyFunction;
        }
        const numbers = functionToUpdate.match(findNumbersRegex);
        if (numbers?.length && vars?.length) {
            for (const number of numbers) {
                const index = parseInt(number.replace("$", ""));
                functionToUpdate = functionToUpdate
                    .replaceAll(`"${number}"`, vars[index] as string)
                    .replaceAll(`'${number}'`, vars[index] as string);
            }
        }
        scope.functions += functionToUpdate + "\n";
    }

    hasFunction(scope: Scope, funcName: string) {
        return scope._funcList.includes(funcName);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getResultString(
        func: (__$DISCORD_DATA$__: TranspiledFuncData) => any,
        args: any[]
    ): string {
        const body = func.toString();
        // if (!/\((\s)*__\$DISCORD_DATA\$__(\s)*\)/.test(body.trim())) {
        //     throw new Error("Function Arg must be name  __$DISCORD_DATA$__");
        // }
        const matchWholeArgwithAsync = /(async\s*)?\(?\s*(\w)*\s*\)?(?=\s*=>)/;
        const argRegex = /\(?\s*(\w)*\s*\)?(?=\s*=>)/;
        const getArg = body.match(argRegex);
        if (!getArg) throw new Error("Function Arg must be present");
        const arg = getArg[0].replace("(", "").replace(")", "").trim();
        let bodyWithoutArg = body.replace(matchWholeArgwithAsync, "");
        bodyWithoutArg = this.#replaceArgInFunctionStringWithDiscord(
            bodyWithoutArg,
            arg
        );
        const removedArrow = bodyWithoutArg.replace("=>", "").trim();

        const bodyWithoutBrackets =
      removedArrow[0] === "{" ? removedArrow.slice(1, -1) : removedArrow;
        const findNumbersRegex = /\$[0-9]+/g;
        const numbers = bodyWithoutBrackets.match(findNumbersRegex);

        if (!numbers) {
            return bodyWithoutBrackets;
        }

        let result = bodyWithoutBrackets;
        for (const number of numbers) {
            const index = parseInt(number.replace("$", ""));
            result = result
                .replaceAll(`"${number}"`, args[index])
                .replaceAll(`'${number}'`, args[index]);
        }
        return result;
    }
    build(): FunctionData {
        return {
            name: this.name,
            type: this.type,
            brackets: this.brackets,
            optional: this.optional,
            fields: this.fields,
            version: this.version,
            default: this.default,
            returns: this.returns,
            description: this.description,
            example: this.example,
            code: this.code,
        };
    }

    #replaceArgInFunctionStringWithDiscord(func: string, arg: string) {
    // it will replace all arg with __$DISCORD_DATA$__ and wont replace same word if it is a part of another word or a property

        const regex = new RegExp(`(?<![a-zA-Z0-9_.])(${arg})(?![a-zA-Z0-9_])`, "g");
        return func.replaceAll(regex, "__$DISCORD_DATA$__");
    }

    conditionalGetResultString(
        condition: boolean,
        trueData: {
      func: (__$DISCORD_DATA$__: TranspiledFuncData) => unknown;
      args: unknown[];
    },
        falseData: {
      func: (__$DISCORD_DATA$__: TranspiledFuncData) => unknown;
      args: unknown[];
    }
    ): string {
        if (condition) return this.getResultString(trueData.func, trueData.args);
        return this.getResultString(falseData.func, falseData.args);
    }
}
