/*
 Copyright 2024 Akarui Development

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
 
		http://www.apache.org/licenses/LICENSE-2.0
 
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

export default class Group<K = unknown, V = unknown> extends Map<K, V> {
    [x: string]: any;
    #maxSize: number;
    /**
     * Creates a new Group
     * @param size - The maximum size of the group
     * @param it - An iterable to initialize the group with
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * console.log(group.size); // 5
	 * console.log(group.get('a')); // 1
	 * ```
	 * 
	 * @example
	 * ```js
	 * const group = new Group(5);
	 * group.set('a', 1);
	 * group.set('b', 2);
	 * console.log(group.size); // 2
	 * console.log(group.get('a')); // 1
	 * ```
     * @returns A new Group
     */
    constructor(size: number, it?: Iterable<readonly [K, V]>) {
        super();
        this.#maxSize = size;
		if (it) {
			for (const [key, value] of it) {
				this.set(key, value);
			}
		}
    }
    /**
     * Returns a filtered group based on the filter function
     * @param func - The filter function
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * const filtered = group.filter((val, key) => key === 'a' || val === 5);
	 * console.log(filtered.size); // 2
	 * ```
     * @returns A new Group
     */
    filter(func: (val: V, key: K, grp: this) => boolean): Group<K, V> {
        const res = new Group<K, V>(this.#maxSize);
        for (const [key, value] of this.entries()) {
            if (func(value, key, this)) res.set(key, value);
        }
        return res;
    }
    /**
     * Returns the values of the group as an array
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * console.log(group.V()); // [1, 2, 3, 4, 5]
	 * ```
     * @returns An array of values
     */
    V(): V[] {
        return [...this.values()];
    }
    /**
     * Returns the keys of the group as an array
	 * @example
	 * ```js
	 * 	const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * 	console.log(group.K()); // ['a', 'b', 'c', 'd', 'e']
	 * ```
     * @returns An array of keys
     */
    K(): K[] {
        return [...this.keys()];
    }
    /**
     * Returns the top element of the group
     * @param amount - The amount of elements to return
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * console.log(group.top()); // 1
	 * ```
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * console.log(group.top(3)); // [1, 2, 3]
	 * ```
     * @returns The top element(s) of the group
     */
    top(amount: number = 1): V | V[] | undefined {
        const res = this.V().slice(0, amount);
        if (res.length === 0) return undefined;
        if (res.length === 1) return res[0];
        return res;
    }
    /**
     * Returns the bottom element of the group
     * @param amount - The amount of elements to return
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * console.log(group.bottom()); // 5
	 * ```
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * console.log(group.bottom(3)); // [5, 4, 3]
	 * ```
     * @returns The bottom element(s) of the group
     */
    bottom(amount: number = 1): V | V[] | undefined {
        const res = this.V().slice(-amount);
        if (res.length === 0) return undefined;
        if (res.length === 1) return res[0];
        return res;
    }
    /**
     * Removes the first element of the group
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * group.shift();
	 * console.log(group.size); // 4
	 * ```
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * console.log(group.shift()); // 1
	 * ```
     * @returns The removed element
     */
    shift(): V | undefined {
        const key = this.keys().next().value;
        if (!key) return undefined;
        const val = this.get(key);
        this.delete(key);
        return val;
    }
	/**
	 * Removes the first n elements of the group
	 * @param amount - The amount of elements to remove
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * group.shiftN(2);
	 * console.log(group.size); // 3
	 * ```
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * console.log(group.shiftN(2)); // [1, 2]
	 * ```
	 * @returns The removed element(s)
	 **/
    shiftN(amount: number): V | V[] | undefined {
        const res: V[] = [];
        for (let i = 0; i < amount; i++) {
            const val = this.shift();
            if (!val) break;
            res.push(val);
        }
        if (res.length === 0) return undefined;
        if (res.length === 1) return res[0];
        return res;
    }
    /**
     * Removes the last element of the group
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * group.pop();
	 * console.log(group.size); // 4
	 * ```
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * console.log(group.pop()); // 5
	 * ```
     * @returns The removed element
     */
    pop(): V | undefined {
        const key = this.K()[this.size - 1];
        if (!key) return undefined;
        const val = this.get(key);
        this.delete(key);
        return val;
    }
	/**
	 * Removes the last n elements of the group
	 * @param amount - The amount of elements to remove
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * group.popN(2);
	 * console.log(group.size); // 3
	 * ```
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * console.log(group.popN(2)); // [5, 4]
	 * ```
	 * @returns The removed element(s)
	 **/
    popN(amount: number): V | V[] | undefined {
        const res: V[] = [];
        const keys = this.K();
        let index = keys.length - 1;
        for (let i = 0; i < amount; i++) {
            const val = this.get(keys[index]);
            if (!val) break;
            res.push(val);
            this.delete(keys[index]);
            index--;
        }
        if (res.length === 0) return undefined;
        if (res.length === 1) return res[0];
        return res;
    }
    /**
     * sets a value in the group
     * @param key - The key to set
     * @param value - The value to set
	 * @example
	 * ```js
	 * const group = new Group(5);
	 * group.set('a', 1);
	 * console.log(group.size); // 1
	 * console.log(group.get('a')); // 1
	 * ```
	 * @example
	 * ```js
	 * const group = new Group(3_;
	 * group.set('a', 1);
	 * group.set('b', 2);
	 * group.set('c', 3);
	 * group.set('d', 4);
	 * console.log(group.size); // 3
	 * console.log(group.get('a')); // undefined
	 * console.log(group.get('b')); // 2
	 * console.log(group.get('c')); // 3
	 * console.log(group.get('d')); // 4
	 * ```
     * @returns The group
     */
    set(key: K, value: V): this {
        if (this.size >= this.#maxSize) this.shift();
        return super.set(key, value);
    }
    /**
     * Adds a value to the group
     * @param value - The value to add
	 * @example
	 * ```js
	 * const group = new Group(5);
	 * group.add(1);
	 * console.log(group.size); // 1
	 * console.log(group.get(1)); // 1
	 * ```
     * @returns The group
     */
    add(value: V): this {
        if (this.size >= this.#maxSize) this.shift();
        return super.set(value as unknown as K, value);
    }
    /**
     * returns the difference between two groups
     * @param other - The other group to compare
     * @example
	 * ```js
	 * const group1 = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const group2 = new Group(5, [['a', 1], ['b', 2], ['d', 4]]);
	 * const diff = group1.diff(group2);
	 * console.log(diff.size); // 2
	 * console.log(diff.get('c')); // 3
	 * console.log(diff.get('d')); // 4
	 * ```
     * @returns The difference between the two groups
     */
    diff(other: Group<K, V>): Group<K, V> {
        const res = new Group<K, V>(this.#maxSize,this.entries());
        for (const key of other.keys()) {
            if (!this.has(key)) res.set(key, other.get(key)!);
			else res.delete(key);
        }
        return res;
    }
	/**
	 * Returns the union of two groups
	 * @param other - The other group to compare
	 * @example
	 * ```js
	 * const group1 = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const group2 = new Group(5, [['a', 1], ['b', 2], ['d', 4]]);
	 * const union = group1.union(group2);
	 * console.log(union.size); // 4
	 * console.log(union.get('a')); // 1
	 * console.log(union.get('b')); // 2
	 * console.log(union.get('c')); // 3
	 * console.log(union.get('d')); // 4
	 * ```
	 * @returns The union of the two groups
	 **/
    union(other: Group<K, V>): Group<K, V> {
        const res = new Group<K, V>(Infinity);
        for (const [key, value] of this.entries()) {
            res.set(key, value);
        }
        for (const [key, value] of other.entries()) {
            res.set(key, value);
        }
        res.#maxSize = this.size;
        return res;
    }
	/**
	 * Returns the intersection of two groups
	 * @param other - The other group to compare
	 * @example
	 * ```js
	 * const group1 = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const group2 = new Group(5, [['a', 1], ['b', 2], ['d', 4]]);
	 * const intersection = group1.intersect(group2);
	 * console.log(intersection.size); // 2
	 * console.log(intersection.get('a')); // 1
	 * console.log(intersection.get('b')); // 2
	 * ```
	 * @returns The intersection of the two groups
	 **/
    intersect(other: Group<K, V>): Group<K, V> {
        const res = new Group<K, V>(Infinity);
        for (const [key, value] of this.entries()) {
            if (other.has(key)) res.set(key, value);
        }
        res.#maxSize = this.size;
        return res;
    }
	/**
	 * Returns the symmetric difference of two groups
	 * @example
	 * ```js
	 * const group1 = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const group2 = group1.clone();
	 * console.log(group2.size); // 3
	 *```
	 * @returns The symmetric difference of the two groups
	 **/
    clone(): Group<K, V> {
        return new Group<K, V>(this.#maxSize, this.entries());
    }
    /**
     * Returns the first matching value in the group
     * @param func - The filter function
     * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const val = group.find((val, key) => key === 'a' || val === 3);
	 * console.log(val); // 1
	 * ```
     * @returns The first matching value
     */
    find(func: (val: V, key: K, grp: this) => boolean): V | undefined {
        for (const [key, value] of this.entries())
            if (func(value, key, this)) return value;
    }
    /**
     * Returns the first matching key in the group
     * @param func - The filter function
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const key = group.findKey((val, key) => key === 'a' || val === 3);
	 * console.log(key); // 'a'
	 * ```
     * @returns The first matching key
     */
    findKey(func: (val: V, key: K, grp: this) => boolean): K | undefined {
        for (const [key, value] of this.entries())
            if (func(value, key, this)) return key;
    }
	/**
	 * Returns the first matching entry in the group
	 * @param func - The filter function
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const entry = group.findEntry((val, key) => key === 'a' || val === 3);
	 * console.log(entry); // ['a', 1]
	 * ```
	 * @returns The first matching entry
	 **/
    findEntry(func: (val: V, key: K, grp: this) => boolean): [K, V] | undefined {
        for (const [key, value] of this.entries())
            if (func(value, key, this)) return [key, value];
    }
	/**
	 * Checking if any value in the group matches the filter function
	 * @param func - The filter function
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const has = group.some((val, key) => key === 'a' || val === 3);
	 * console.log(has); // true
	 * ```
	 * @returns Whether any value in the group matches the filter function
	 */
    some(func: (val: V, key: K, grp: this) => boolean): boolean {
        for (const [key, value] of this.entries())
            if (func(value, key, this)) return true;
		return false;
    }
	/**
	 * Checking if all values in the group match the filter function
	 * @param func - The filter function
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const all = group.every((val, key) => key === 'a' || val === 3);
	 * console.log(all); // false
	 * ```
	 * @returns Whether all values in the group match the filter function
	 */
    every(func: (val: V, key: K, grp: this) => boolean): boolean {
        for (const [key, value] of this.entries())
            if (!func(value, key, this)) return false;
		return true;
    }
	/**
	 * map over the group and return a new group with the new values
	 * @param func - The map function
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const mapped = group.map((val, key) => val * 2);
	 * console.log(mapped.get('a')); // 2
	 * console.log(mapped.get('b')); // 4
	 * console.log(mapped.get('c')); // 6
	 * ```
	 * @returns A new Group
	 */
    map<T>(func: (val: V, key: K, grp: this) => T): Group<K, T> {
        const res = new Group<K, T>(this.#maxSize);
        for (const [key, value] of this.entries())
            res.set(key, func(value, key, this));
        return res;
    }
	/**
	 * Returns the index of the first matching value in the group
	 * @param func - The filter function
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const index = group.findIndex((val, key) => key === 'a' || val === 3);
	 * console.log(index); // 0
	 * ```
	 * @returns The index of the first matching value 
	 */
    findIndex(func: (val: V, key: K, grp: this) => boolean): number {
        let i = 0;
        for (const [key, value] of this.entries()) {
            if (func(value, key, this)) return i;
            i++;
        }
		return -1;
    }
	/**
	 * Reduces the group to a single value
	 * @param func - The reduce function
	 * @param init - The initial value
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * const reduced = group.reduce((acc, val) => acc + val, 0);
	 * console.log(reduced); // 6
	 * ```
	 * @returns The reduced value
	 */
    reduce(func: (acc: V, val: V, key: K, grp: this) => V, init?: V): V | undefined {
        let acc = init;
        for (const [key, value] of this.entries()) {
            if (acc === undefined) acc = value;
            else acc = func(acc, value, key, this);
        }
        return acc;
    }
	/**
	 * breaks the group into two groups based on the filter function
	 * @param func - The filter function
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]]);
	 * const [trueGroup, falseGroup] = group.break((val, key) => key === 'a' || val === 5);
	 * console.log(trueGroup.size); // 2
	 * console.log(falseGroup.size); // 3
	 * ```
	 * @returns An array of two groups
	 */
    break(func: (val: V, key: K, grp: this) => boolean): [Group<K, V>, Group<K, V>] {
        const trueGroup = new Group<K, V>(this.#maxSize);
        const falseGroup = new Group<K, V>(this.#maxSize);
        for (const [key, value] of this.entries()) {
            if (func(value, key, this)) trueGroup.set(key, value);
            else falseGroup.set(key, value);
        }
        return [trueGroup, falseGroup];
    }
	/**
	 * Returns the maximum size of the group
	 */
    get maxSize(): number {
        return this.#maxSize;
    }
	/**
	 * Sets the maximum size of the group
	 * @param value - The new maximum size
	 * @example
	 * ```js
	 * const group = new Group(5);
	 * group.maxSize = 10;
	 * console.log(group.maxSize); // 10
	 * ```
	 * @returns The new maximum size
	 **/
    set maxSize(value: number) {
        this.#maxSize = value;
    }
	/**
	 * Sorts the group based on the comparator function
	 * @param func - The comparator function
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 3], ['b', 1], ['c', 2]]);
	 * const sorted = group.sort((a, b) => a - b);
	 * console.log(sorted.V()); // [1, 2, 3]
	 * ```
	 * @returns A new Group
	 */
    sort(func: (a: V, b: V) => number): Group<K, V> {
        const arr = [...this.entries()];
        arr.sort(([, a], [, b]) => func(a, b));
        return new Group<K, V>(this.#maxSize, arr);
    }
	/**
	 * Weakly sorts the group
	 * @example
	 * ```js
	 * const group = new Group(5, [['c', 3], ['a', 1], ['b', 2]]);
	 * const sorted = group.weakSort();
	 * console.log(sorted.K()); // ['a', 'b', 'c']
	 * ```
	 * @returns A new Group
	 **/
    weakSort(): Group<K, V> {
        const arr = [...this.entries()].sort();
        return new Group<K, V>(this.#maxSize, arr);
    }
	/**
	 * Sorts the group based on the keys
	 * @param func - The comparator function
	 * @example
	 * ```js
	 * const group = new Group(5, [['c', 3], ['a', 1], ['b', 2]]);
	 * const sorted = group.sortKeys((a, b) => a.localeCompare(b));
	 * console.log(sorted.K()); // ['a', 'b', 'c']
	 * ```
	 * @returns A new Group
	 */
    sortKeys(func: (a: K, b: K) => number): Group<K, V> {
        const arr = [...this.entries()];
        arr.sort(([a], [b]) => func(a, b));
        return new Group<K, V>(this.#maxSize, arr);
    }
	/**
	 * converts the group to a JSON object
	 * @example
	 * ```js
	 * const group = new Group(5, [['a', 1], ['b', 2], ['c', 3]]);
	 * console.log(group.toJSON()); // { a: 1, b: 2, c: 3 }
	 * ```
	 * @returns A JSON object
	 */
    toJSON(): Record<string, V> {
        const obj: Record<string, V> = {};
        for (const [key, value] of this.entries()) {
            obj[key as unknown as string] = value;
        }
        return obj;
    }
}
