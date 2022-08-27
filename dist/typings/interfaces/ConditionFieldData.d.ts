import AoiOperators from "../enums/AoiOperators";
import { FieldData } from "./FieldData";
export interface ConditionField extends Omit<FieldData, 'overloads' | 'executor'> {
    op: typeof AoiOperators[number];
    left: FieldData;
    value: string;
    right: FieldData;
}
//# sourceMappingURL=ConditionFieldData.d.ts.map