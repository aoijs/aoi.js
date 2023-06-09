import { StringObject, parseStringObject } from "../../..";
import Scope from "../../../core/structs/Scope.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeResult,
} from "../../../util/transpilerHelpers.js";
export const $useComponent: FunctionData = {
    name: "$useComponent",
    brackets: true,
    optional: false,
    type: "function_getter",
    fields: [
        {
            name: "name",
            type: "string",
            required: true,
        },
        {
            name: "data",
            type: "object",
            required: false,
        },
    ],
    description: "use a component in the code",
    default: ["void", "undefined"],
    returns: "any",
    version: "7.0.0",
    code: (data: funcData, scope: Scope[]) => {
        const currentScope = scope.at(-1) as Scope;
        //code here

        const [name,...rest] = data.splits;
        const actualRestData = rest.join(";");

        const currentObj = new StringObject("{");
        currentObj.addEnd("}");

        const obj = parseStringObject(actualRestData, currentObj);

        const res= escapeResult(`
        await (async()=>{
          const Cmp_${name} = await __$Discord_Data$__.bot.executeComponent("${name}",{
            ...__$Discord_Data$__,
            ...${obj.solve()}
          };
          if(!Cmp_${name}.success) throw new Error("Sample Error",{
            component: "${name}",
            success: Cmp_${name}.success,
          });
          return Cmp_${name}.data;
        })().catch((e)=>{throw new Error(e.message);})
          `
        );

        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
