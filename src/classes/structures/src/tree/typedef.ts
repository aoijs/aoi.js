import { Branch } from "./branch";
import { Leaf } from "./leaf";

export type func<U> = (arg:any,index:number,array:any[])=> U
export type TreeK = string;
export type TreeV = Leaf | Branch;
