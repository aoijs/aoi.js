import { Branch } from "../../src/tree/branch";
declare type K = string;
declare type V = Branch;
export declare class Tree {
    name: string;
    age: number;
    branches: Map<K, V>;
    constructor(name: string, age?: number);
    /**
     * @method addBranch
     * @description adds a Branch in the Tree
     * @param name name of the Branch
     * @param size size of the Branch
     * @return Branch
     */
    addBranch(name: string, size?: number): Branch;
    /**
     * @method deleteBranch
     * @description delete a Branch in the Tree
     * @param name name of the Branch
     * @return void
     */
    deleteBranch(name: string): void;
    /**
     * @method clear
     * @description clears the Tree
     * @return void
     */
    clear(): void;
    /**
     * @method clearBranch
     * @description clears a Branch in the Tree
     * @param name name of the Branch
     * @return void
     */
    clearBranch(name: string): void;
    /**
     * @method branchCount
     * @description returns the number of branches in the tree
     * @readonly
     * @return number
     */
    get branchCount(): number;
}
export {};
//# sourceMappingURL=tree.d.ts.map