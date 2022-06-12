"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const branch_1 = require("./branch");
class Tree {
    name;
    age;
    branches;
    constructor(name, age = Infinity) {
        this.name = name;
        this.age = age;
        this.branches = new Map();
    }
    /**
     * @method addBranch
     * @description adds a Branch in the Tree
     * @param name name of the Branch
     * @param size size of the Branch
     * @return Branch
     */
    addBranch(name, size = Infinity) {
        const newBranch = new branch_1.Branch(name, this);
        this.branches.set(name, newBranch);
        return newBranch;
    }
    /**
     * @method deleteBranch
     * @description delete a Branch in the Tree
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
     * @method clear
     * @description clears the Tree
     * @return void
     */
    clear() {
        this.branches.clear();
    }
    /**
     * @method clearBranch
     * @description clears a Branch in the Tree
     * @param name name of the Branch
     * @return void
     */
    clearBranch(name) {
        if (!this.branches.has(name))
            throw new Error("Branch With Name: " + name + " Doesn't Exist");
        else
            this.branches.set(name, new branch_1.Branch(name, this));
    }
    /**
     * @method branchCount
     * @description returns the number of branches in the tree
     * @readonly
     * @return number
     */
    get branchCount() {
        return this.branches.size;
    }
}
exports.Tree = Tree;
//# sourceMappingURL=tree.js.map