import { TranspilerError } from "../../../core/error.js";
import { StringObject, parseStringObject } from "../../../index.js";
import { escapeResult, escapeVars, } from "../../../util/transpilerHelpers.js";
export const $createObject = {
    name: "$createObject",
    brackets: true,
    optional: false,
    type: "setter",
    version: "7.0.0",
    fields: [
        {
            name: "name",
            type: "string",
            required: true,
        },
        {
            name: "object",
            type: "json",
            required: true,
        },
    ],
    description: "creates an Object",
    default: ["void", "void"],
    returns: "void",
    code: (data, scope) => {
        const currentScope = scope[scope.length - 1];
        const [name, ...obj] = data.splits;
        const parsedObj = obj.join(";").trim();
        if (!obj.length &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")) {
            throw new TranspilerError(`${data.name}: No Object Provided`);
        }
        const currentObj = new StringObject("{");
        currentObj.addEnd("}");
        let object;
        try {
            object = parseStringObject(parsedObj, currentObj);
        }
        catch (e) {
            throw new TranspilerError(`${data.name}: Invalid Object Provided`);
        }
        const res = escapeResult(`const ${escapeVars(name)} =  ${object.solve()};`);
        currentScope.objects[name] = object;
        currentScope.update(res, data);
        return {
            code: "",
            scope,
        };
    },
};
//# sourceMappingURL=$createObject.js.map