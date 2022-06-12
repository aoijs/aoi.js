/** @format */
import { Branch } from "../../src/tree/branch";
export declare class Leaf {
    name: string;
    private data;
    branch: Branch;
    constructor(name: string, branch: Branch);
    /**
     * @method baseSort
     * @description sorts the Data ( classic js Array.sort() )
     * @similiar Array.sort()
     * @param compareFunction function to sort
     * @return any[]
     */
    baseSort(compareFunction: (a: number, b: number) => number): any[];
    /**
     * @method weakSort
     * @description weakly sorts the data ( basically  Array.sort() without any compareFunction )
     * @similiar Array.sort()
     * @return any[]
     */
    weakSort(): any[];
    /**
     * @method qiuckSort
     * @description quick sorts the data ( sorts number in increasing order, same for strings )
     * @similiar Array.sort()
     * @return any[]
     */
    quickSort(): any[];
    /**
     * @method delete
     * @description deletes itself
     * @return void
     */
    delete(): void;
    /**
     * @method clear
     * @description clears all data
     * @similiar Map.clear()
     * @return void
     */
    clear(): void;
    /**
     * @method map
     * @description maps a function over the data and return it
     * @similiar Array.map()
     * @param {func} func function to be looped over
     * @param {any?} thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     * @return U[]
     */
    map<U>(func: (arg: any, index: number, array: any[]) => U, thisArg?: any): U[];
    /**
     * @typedef {(arg:any,index:number,array:any[])=>U} func<U>
     * @description loops a function over the data
     * @similiar Array.forEach()
     * @param  {func} func
     * @param  {any?} thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     * @returns {void} void
     */
    forEach<U>(func: (arg: any, index: number, array: any[]) => U, thisArg?: any): void;
    searchValue(value: string | number, sort?: boolean): any;
    /**
     * @method add
     * @description adds an element to Leaf
     * @similiar Array.push()
     * @param  {any} value
     * @returns number
     */
    add(value: any): number;
    /**
     * @method set
     * @description sets the value of element in leaf using ita position
     * @similiar \<Array\>[index] = value
     * @param  {number} index index in the Leaf
     * @param  {any} value value of that index
     * @returns {void} void
     */
    set(index: number, value: any): void;
}
//# sourceMappingURL=leaf.d.ts.map