import { Function } from "../../structures/Function";
import intoFunction from "../../util/functions/intoFunction";
export interface FieldData {
    value: string;
    overloads: Function[];
    executor: ReturnType<typeof intoFunction>;
}
//# sourceMappingURL=FieldData.d.ts.map