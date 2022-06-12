"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedMap = void 0;
class IndexedMap {
    data = new Map();
    constructor(data) {
        this.bind(data);
    }
    /**
     * @method size
     * @description gets the size of Map
     * @readonly true
     */
    get size() {
        return this.data.size;
    }
    bind(data) {
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
    add(value) {
        this.data.set(this.size, value);
        return this;
    }
    /**
     * @method remove
     * @description removes the data from map
     * @param {number} index index of the data in map
     */
    remove(index) {
        return this.data.delete(index);
    }
    /**
     * @method findAndRemove
     * @description finds the data based on function provided and then deletes it
     * @param {(value: V, index?: number, IndexedMap?: this)} func function to find data in map
     */
    findAndRemove(func) {
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
    find(func) {
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
    map(func) {
        const res = [];
        for (const [index, value] of this.data) {
            res.push(func(value, index, this));
        }
        return res;
    }
    /**
     * asyncMap
     */
    async asyncMap(func) {
        const res = [];
        for (const [key, value] of this.data) {
            res.push(func(value, key, this));
        }
        return res;
    }
}
exports.IndexedMap = IndexedMap;
//# sourceMappingURL=indexedMap.js.map