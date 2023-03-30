import Condition from "../structs/Condition.js";
export const operators = ["===", "!==", "==", "!=", ">", "<", ">=", "<="];

export function countSBrackets(condition: string) {
    const sBrackets = condition.match(/\(/g);
    const eBrackets = condition.match(/\)/g);
    return {
        right: sBrackets ? sBrackets.length : 0,
        left: eBrackets ? eBrackets.length : 0,
    };
}
export function areSBracketsBalanced(condition: string) {
    const { left, right } = countSBrackets(condition);
    return left === right;
}
export function conditionLexer(condition: string) {
    let tempCondition;
    if (condition.includes("#FUNCTION_START#")) {
        const matches = condition.match(
            /((#FUNCTION_START#([$a-z.0-9\s?(){}\[\]._:'"`;=><,!-]|\n)+#FUNCTION_END#)|(__\$[a-z_?.()]+\$__))/gim,
        );
        if (matches) {
            for (let match of matches) {
                const newmatch = match
                    .replaceAll("(", "#SMOOTH_BRACKET_LEFT#")
                    .replaceAll(")", "#SMOOTH_BRACKET_RIGHT#");
                condition = condition.replace(match, newmatch);
            }
            tempCondition = condition;
        }
        tempCondition = condition;
    } else {
        tempCondition = condition;
    }
    let i = 0;
    let starter = new Condition("");
    while (i < tempCondition.length) {
        if (tempCondition[i] === "(") {
            const nest = new Condition("", starter);
            starter.add("#CONDITION#");
            starter.nest.push(nest);
            starter = nest;
        } else if (tempCondition[i] === ")") {
            if (starter.parent) starter = starter.parent;
            else break;
        } else {
            starter.add(tempCondition[i]);
        }
        i++;
    }
    return starter;
}
