export declare class IndexedMap<V = any> {
    private data;
    constructor(data: any);
    /**
     * @method size
     * @description gets the size of Map
     * @readonly true
     */
    get size(): number;
    private bind;
    /**
     * @method add
     * @description adds the data to map
     * @param {V} value adds value  to data
     */
    add(value: V): this;
    /**
     * @method remove
     * @description removes the data from map
     * @param {number} index index of the data in map
     */
    remove(index: number): boolean;
    /**
     * @method findAndRemove
     * @description finds the data based on function provided and then deletes it
     * @param {(value: V, index?: number, IndexedMap?: this)} func function to find data in map
     */
    findAndRemove(func: (value: V, index?: number, IndexedMap?: this) => boolean): boolean | undefined;
    /**
     * @method find
     * @description finds the data based on the function Provided
     * @param {(value: V, index?: number, IndexedMap?: this)} func function to find the data in map
     */
    find(func: (value: V, index?: number, IndexedMap?: this) => boolean): V | undefined;
    /**
     * @method map
     * @description maps a function on values in Map
     * @param {(value: V, index?: number, IndexedMap?: this)} func function to be mapped on the datas
     */
    map<U>(func: (value: V, index?: number, IndexedMap?: this) => U): U[];
    /**
     * asyncMap
     */
    asyncMap<U>(func: (val: V, key: number, grp: this) => U): Promise<U[]>;
}
//# sourceMappingURL=indexedMap.d.ts.map