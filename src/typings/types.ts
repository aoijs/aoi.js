import { TranspiledFuncData } from "./interfaces.js";

export type CommandTypes = "basicCommand" | "slashCommand";
export type AsyncFunction = (arg:TranspiledFuncData) => Promise<any>;