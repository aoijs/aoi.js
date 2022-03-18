import { FunctionData } from "../typings/interfaces/FunctionData";
import { Option } from "../typings/types/Option";
import { Return } from "./Return";
import { ReturnType as RTNType } from "../typings/enums/ReturnType";
import { ThisArg } from "./ThisArg";
import { FieldData } from "../typings/interfaces/FieldData";
import { FieldData as FLD, FunctionData as FND } from "aoi-compiler";
import intoFunction from "../util/functions/intoFunction";
import { ConditionFieldUnion } from "../typings/types/ConditionFieldUnion";
export declare class Function {
    #private;
    data: FunctionData;
    inside: Option<string>;
    fields: Option<FieldData[]>;
    conditionFields: ConditionFieldUnion[];
    id: string;
    executor: ReturnType<typeof intoFunction>;
    constructor(data: FunctionData, id: string);
    setInside(str: Option<string>): this;
    resolveConditionField(arg: ThisArg, data: ConditionFieldUnion): Promise<Return | Option<boolean>>;
    getConditionField(pos: number): Option<ConditionFieldUnion>;
    /**
     * Gets an image of this function.
     */
    get image(): string;
    resolveAll(arg: ThisArg): Promise<Return<RTNType, unknown>>;
    /**
     * This function is not fully optimized, beware from using it too much.
     * @param arg
     * @param field
     * @param code
     * @returns
     */
    resolveCode(arg: ThisArg, field?: Option<FieldData>, code?: Option<string>): Promise<Return>;
    /**
     * This function is not fully optimized, beware from using it too much.
     * @param arg
     * @param fields
     * @param codes
     * @returns
     */
    resolveCodes(arg: ThisArg, fields?: Option<(FieldData | undefined)[]>, codes?: Option<string>[]): Promise<Return>;
    resolveArray(arg: ThisArg, offset?: number): Promise<Return>;
    setFields(fields: FLD[]): this;
    static create(raw: FunctionData, data: FND): Function;
    get str(): string | undefined;
    field(index: number): FieldData | undefined;
    hasFields(): boolean;
    resolveField(arg: ThisArg, field?: Option<FieldData>): Promise<Return>;
}
//# sourceMappingURL=Function.d.ts.map