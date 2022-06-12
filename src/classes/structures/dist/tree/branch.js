"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Branch = void 0;
const leaf_1 = require("./leaf");
class Branch {
    name;
    branches;
    leaves;
    constructor(name, tree) {
        this.name = name;
        this.branches = new Map();
        this.leaves = new Map();
        Object.defineProperty(this, "tree", { value: tree });
    }
    /**
     * @method addBranch
     * @description adds a Branch in the Branch
     * @param name name of the Branch
     * @return Branch
     */
    addBranch(name) {
        const newBranch = new Branch(name, this.tree);
        this.branches.set(name, newBranch);
        return newBranch;
    }
    /**
     * @method addLeaf
     * @description adds a Leaf in the Branch
     * @param name name of the Leaf
     * @return Leaf
     */
    addLeaf(name) {
        const newLeaf = new leaf_1.Leaf(name, this);
        this.leaves.set(name, newLeaf);
        return newLeaf;
    }
    /**
     * @method clearLeaf
     * @description clears a Leaf in the Branch
     * @param name name of the Leaf
     * @return void
     */
    clearLeaf(name) {
        if (!this.leaves.has(name))
            throw new Error("Leaf With Name: " + name + " Doesn't Exist");
        else
            this.leaves.set(name, new leaf_1.Leaf(name, this));
    }
    /**
     * @method clearBranch
     * @description clears a Branch in the Branch
     * @param name name of the Branch
     * @return void
     */
    clearBranch(name) {
        if (!this.branches.has(name))
            throw new Error("Branch With Name: " + name + " Doesn't Exist");
        else
            this.branches.set(name, new Branch(name, this.tree));
    }
    /**
     * @method clearSelf
     * @description clears itself
     * @return void
     */
    clearSelf() {
        this.branches = new Map();
        this.leaves = new Map();
    }
    /**
     * @method deleteSelf
     * @description deletes this branch
     * @return void
     */
    deleteSelf() {
        this.tree.branches.delete(this.name);
    }
    /**
     * @method deleteBranch
     * @description delete a Branch in the Branch
     * @param name name of the Branch
     * @return void
     */
    deleteBranch(name) {
        if (!this.branches.has(name))
            throw new Error("Branch With Name: " + name + " Doesn't Exist");
        else
            this.branches.delete(name);
    }
    /**
     * @method deleteLeaf
     * @description deletes a Leaf in the Branch
     * @param name name of the Leaf
     * @return void
     */
    deleteLeaf(name) {
        if (!this.leaves.has(name))
            throw new Error("Leaf With Name: " + name + " Doesn't Exist");
        else
            this.leaves.delete(name);
    }
    /**
     * @method treeName
     * @description returns the Head Tree Name
     * @readonly
     * @return string
     */
    get treeName() {
        return this.tree.name;
    }
    /**
     * @method tree
     * @description returns Head Tree
     * @readonly
     * @return Tree
     */
    get tree() {
        return this.tree;
    }
}
exports.Branch = Branch;
//# sourceMappingURL=branch.js.map