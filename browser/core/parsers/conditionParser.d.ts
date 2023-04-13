import Condition from "../structs/Condition.js";
export declare const operators: string[];
export declare function countSBrackets(condition: string): {
    right: number;
    left: number;
};
export declare function areSBracketsBalanced(condition: string): boolean;
export declare function conditionLexer(condition: string): Condition;
//# sourceMappingURL=conditionParser.d.ts.map