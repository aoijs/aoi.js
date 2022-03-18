import { ThisArg } from "../../structures/ThisArg";
import { Async } from "../types/Async";
import { FunctionFieldTypes } from "../types/FunctionFieldTypes";
export interface FunctionFieldData {
    /**
     * The name of this field.
     */
    name: string;
    /**
     * The description of this field.
     */
    description: string;
    /**
     * The type of this field.
     */
    type: FunctionFieldTypes;
    /**
     * Whether this field is required.
     */
    required?: boolean;
    /**
     * An array of choices for the user to pick from.
     */
    choices?: [string, unknown][];
    /**
     * When a channel is needed, this is useful to point to a field's output to get data from that specific value.
     */
    pointer?: number;
    /**
     * Whether to parse all the other arguments using this field.
     */
    rest?: boolean;
    /**
     * The default value for a field.
     */
    default?: (this: ThisArg) => Async<unknown> | unknown;
}
//# sourceMappingURL=FunctionFieldData.d.ts.map