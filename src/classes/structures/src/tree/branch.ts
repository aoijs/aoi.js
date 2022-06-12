/** @format */

import { Leaf } from "./leaf";
import { Tree } from "./tree";
import { TreeK as K, TreeV as V } from "./typedef";
export class Branch {
	name: string;
	branches: Map<K, V>;
	leaves: Map<K, V>;
	constructor(name: string, tree: Tree) {
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
	public addBranch(name: any): Branch {
		const newBranch: Branch = new Branch(name, this.tree);

		this.branches.set(name, newBranch);
		return newBranch;
	}
	/**
	 * @method addLeaf
	 * @description adds a Leaf in the Branch
	 * @param name name of the Leaf
	 * @return Leaf
	 */
	public addLeaf(name: any): Leaf {
		const newLeaf: Leaf = new Leaf(name, this);

		this.leaves.set(name, newLeaf);
		return newLeaf;
	}
	/**
	 * @method clearLeaf
	 * @description clears a Leaf in the Branch
	 * @param name name of the Leaf
	 * @return void
	 */
	public clearLeaf(name: string): void {
		if (!this.leaves.has(name))
			throw new Error("Leaf With Name: " + name + " Doesn't Exist");
		else this.leaves.set(name, new Leaf(name, this));
	}
	/**
	 * @method clearBranch
	 * @description clears a Branch in the Branch
	 * @param name name of the Branch
	 * @return void
	 */
	public clearBranch(name: string): void {
		if (!this.branches.has(name))
			throw new Error("Branch With Name: " + name + " Doesn't Exist");
		else this.branches.set(name, new Branch(name, this.tree));
	}
	/**
	 * @method clearSelf
	 * @description clears itself
	 * @return void
	 */
	public clearSelf(): void {
		this.branches = new Map();
		this.leaves = new Map();
	}
	/**
	 * @method deleteSelf
	 * @description deletes this branch
	 * @return void
	 */
	public deleteSelf(): void {
		this.tree.branches.delete(this.name);
	}
	/**
	 * @method deleteBranch
	 * @description delete a Branch in the Branch
	 * @param name name of the Branch
	 * @return void
	 */
	public deleteBranch(name: string): void {
		if (!this.branches.has(name))
			throw new Error("Branch With Name: " + name + " Doesn't Exist");
		else this.branches.delete(name);
	}
	/**
	 * @method deleteLeaf
	 * @description deletes a Leaf in the Branch
	 * @param name name of the Leaf
	 * @return void
	 */
	public deleteLeaf(name: string): void {
		if (!this.leaves.has(name))
			throw new Error("Leaf With Name: " + name + " Doesn't Exist");
		else this.leaves.delete(name);
	}
	/**
	 * @method treeName
	 * @description returns the Head Tree Name
	 * @readonly
	 * @return string
	 */
	public get treeName(): string {
		return this.tree.name;
	}
	/**
	 * @method tree
	 * @description returns Head Tree
	 * @readonly
	 * @return Tree
	 */
	public get tree(): Tree {
		return this.tree;
	}
}
