/** @format */
import { Leaf } from "../../src/tree/leaf";
import { Tree } from "../../src/tree/tree";
import { TreeK as K, TreeV as V } from "../../src/tree/typedef";
export declare class Branch {
    name: string;
    branches: Map<K, V>;
    leaves: Map<K, V>;
    constructor(name: string, tree: Tree);
    /**
     * @method addBranch
     * @description adds a Branch in the Branch
     * @param name name of the Branch
     * @return Branch
     */
    addBranch(name: any): Branch;
    /**
     * @method addLeaf
     * @description adds a Leaf in the Branch
     * @param name name of the Leaf
     * @return Leaf
     */
    addLeaf(name: any): Leaf;
    /**
     * @method clearLeaf
     * @description clears a Leaf in the Branch
     * @param name name of the Leaf
     * @return void
     */
    clearLeaf(name: string): void;
    /**
     * @method clearBranch
     * @description clears a Branch in the Branch
     * @param name name of the Branch
     * @return void
     */
    clearBranch(name: string): void;
    /**
     * @method clearSelf
     * @description clears itself
     * @return void
     */
    clearSelf(): void;
    /**
     * @method deleteSelf
     * @description deletes this branch
     * @return void
     */
    deleteSelf(): void;
    /**
     * @method deleteBranch
     * @description delete a Branch in the Branch
     * @param name name of the Branch
     * @return void
     */
    deleteBranch(name: string): void;
    /**
     * @method deleteLeaf
     * @description deletes a Leaf in the Branch
     * @param name name of the Leaf
     * @return void
     */
    deleteLeaf(name: string): void;
    /**
     * @method treeName
     * @description returns the Head Tree Name
     * @readonly
     * @return string
     */
    get treeName(): string;
    /**
     * @method tree
     * @description returns Head Tree
     * @readonly
     * @return Tree
     */
    get tree(): Tree;
}
//# sourceMappingURL=branch.d.ts.map