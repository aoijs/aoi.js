import { FunctionData } from "../typings/interfaces.js";
import * as JSFuncs from "./js/index.js";

const functions: Record<string, FunctionData> = {
    ...JSFuncs,
};

export default functions;
