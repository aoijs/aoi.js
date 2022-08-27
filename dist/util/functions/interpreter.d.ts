import { InterpreterData } from "../../typings/interfaces/InterpreterData";
import { InterpreterDataReturn } from "../../typings/types/InterpreterDataReturn";
import { InterpreterReturnType } from "../constants/enums/InterpreterReturnType";
declare function interpreter<T extends InterpreterReturnType = InterpreterReturnType>(data: InterpreterData<T>): Promise<InterpreterDataReturn<T>>;
export default interpreter;
//# sourceMappingURL=interpreter.d.ts.map