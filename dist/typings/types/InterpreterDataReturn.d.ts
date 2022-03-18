import { Container } from "../../structures/Container";
import { InterpreterReturnType } from "../../util/constants/enums/InterpreterReturnType";
import { Option } from "./Option";
export declare type InterpreterDataReturn<T extends InterpreterReturnType> = T extends InterpreterReturnType.None ? null : T extends InterpreterReturnType.Container ? Container : T extends InterpreterReturnType.Output ? Option<string> : never;
//# sourceMappingURL=InterpreterDataReturn.d.ts.map