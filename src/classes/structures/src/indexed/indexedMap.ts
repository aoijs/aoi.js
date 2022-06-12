import { IndexedData } from "./types";

export class IndexedMap<V = any> {
	private data: Map<number, V> = new Map();
	constructor(data: any) {
		this.bind(data);
	}
	/**
	 * @method size
	 * @description gets the size of Map
	 * @readonly true
	 */
	public get size() {
		return this.data.size;
	}
	private bind(data: IndexedData) {
		if (typeof data === "object") {
			for (const [_, value] of Object.entries(data)) {
				this.data.set(this.size, value);
			}
		}
	}
	/**
	 * @method add
	 * @description adds the data to map
	 * @param {V} value adds value  to data
	 */
	public add(value: V): this {
		this.data.set(this.size, value);
		return this;
	}
	/**
	 * @method remove
	 * @description removes the data from map
	 * @param {number} index index of the data in map
	 */
	public remove(index: number): boolean {
		return this.data.delete(index);
	}
	/**
	 * @method findAndRemove
	 * @description finds the data based on function provided and then deletes it
	 * @param {(value: V, index?: number, IndexedMap?: this)} func function to find data in map
	 */
	public findAndRemove(
		func: (value: V, index?: number, IndexedMap?: this) => boolean,
	) {
		for (const [index, value] of this.data) {
			if (func(value, index, this)) {
				return this.data.delete(index);
				break;
			}
		}
	}
	/**
	 * @method find
	 * @description finds the data based on the function Provided
	 * @param {(value: V, index?: number, IndexedMap?: this)} func function to find the data in map
	 */
	public find(
		func: (value: V, index?: number, IndexedMap?: this) => boolean,
	 ) {
		for (const [index, value] of this.data) {
			if (func(value, index, this)) {
				return value;
				break;
			}
		}
	}
	/**
	 * @method map
	 * @description maps a function on values in Map
	 * @param {(value: V, index?: number, IndexedMap?: this)} func function to be mapped on the datas
	 */
	public map<U>(func: (value: V, index?: number, IndexedMap?: this) => U): U[] {
		const res: U[] = [];
		for (const [index, value] of this.data) {
			res.push(func(value, index, this));
		}
		return res;
	}
	/**
	 * asyncMap
	 */
	public async asyncMap<U>(
		func: (val: V, key: number, grp: this) => U,
	): Promise<U[]> {
		const res: U[] = [];
		for (const [key, value] of this.data) {
			res.push(func(value, key, this));
		}
		return res;
	}
}
