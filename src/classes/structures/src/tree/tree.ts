import { Branch } from "./branch";
import { Leaf } from "./leaf";
type K = string;
type V = Branch;
export class Tree {
	name: string;
	age: number;
	branches: Map<K, V>;
	constructor(name: string, age = Infinity) {
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
	public addBranch(name: string, size = Infinity): Branch {
		const newBranch = new Branch(name, this);

		this.branches.set(name, newBranch);
		return newBranch;
	}
	/**
	 * @method deleteBranch
	 * @description delete a Branch in the Tree
	 * @param name name of the Branch
	 * @return void
	 */
	public deleteBranch(name: string): void {
		if (!this.branches.has(name))
			throw new Error("Branch With Name: " + name + " Doesn't Exist");
		else this.branches.delete(name);
	}
	/**
	 * @method clear
	 * @description clears the Tree
	 * @return void
	 */
	public clear(): void {
		this.branches.clear();
	}
	/**
	 * @method clearBranch
	 * @description clears a Branch in the Tree
	 * @param name name of the Branch
	 * @return void
	 */
	public clearBranch(name: string): void {
		if (!this.branches.has(name))
			throw new Error("Branch With Name: " + name + " Doesn't Exist");
		else this.branches.set(name, new Branch(name, this));
	}
	/**
	 * @method branchCount
	 * @description returns the number of branches in the tree
	 * @readonly
	 * @return number
	 */
	public get branchCount(): number {
		return this.branches.size;
	}
}
