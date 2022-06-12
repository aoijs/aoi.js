"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leaf = void 0;
class Leaf {
    name;
    data;
    branch;
    constructor(name, branch) {
        this.name = name;
        this.branch = branch;
        this.data = [];
    }
    /**
     * @method baseSort
     * @description sorts the Data ( classic js Array.sort() )
     * @similiar Array.sort()
     * @param compareFunction function to sort
     * @return any[]
     */
    baseSort(compareFunction) {
        const sorted = this.data.sort(compareFunction);
        this.data = sorted;
        return sorted;
    }
    /**
     * @method weakSort
     * @description weakly sorts the data ( basically  Array.sort() without any compareFunction )
     * @similiar Array.sort()
     * @return any[]
     */
    weakSort() {
        const sorted = this.data.sort();
        this.data = sorted;
        return sorted;
    }
    /**
     * @method qiuckSort
     * @description quick sorts the data ( sorts number in increasing order, same for strings )
     * @similiar Array.sort()
     * @return any[]
     */
    quickSort() {
        const sorted = this.data.sort((a, b) => {
            if (a < b)
                return 1;
            else if (a > b)
                return -1;
            else
                return 0;
        });
        this.data = sorted;
        return sorted;
    }
    /**
     * @method delete
     * @description deletes itself
     * @return void
     */
    delete() {
        this.branch.branches.delete(this.name);
    }
    /**
     * @method clear
     * @description clears all data
     * @similiar Map.clear()
     * @return void
     */
    clear() {
        this.data = [];
    }
    /**
     * @method map
     * @description maps a function over the data and return it
     * @similiar Array.map()
     * @param {func} func function to be looped over
     * @param {any?} thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     * @return U[]
     */
    map(func, thisArg) {
        return this.data.map(func, thisArg);
    }
    /**
     * @typedef {(arg:any,index:number,array:any[])=>U} func<U>
     * @description loops a function over the data
     * @similiar Array.forEach()
     * @param  {func} func
     * @param  {any?} thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     * @returns {void} void
     */
    forEach(func, thisArg) {
        return this.data.forEach(func, thisArg);
    }
    searchValue(value, sort = true) {
        if (sort) {
            this.data = this.data.sort((a, b) => {
                if (a < b)
                    return 1;
                else if (a > b)
                    return -1;
                else
                    return 0;
            });
        }
        let start = 0;
        let end = this.data.length - 1;
        let vm;
        while (start <= end) {
            let mid = Math.floor((start + end) / 2);
            vm = this.data[mid];
            if (value > vm)
                start = mid + 1;
            else if (value < vm)
                end = mid - 1;
            else
                break;
        }
        return vm;
    }
    /**
     * @method add
     * @description adds an element to Leaf
     * @similiar Array.push()
     * @param  {any} value
     * @returns number
     */
    add(value) {
        return this.data.push(value);
    }
    /**
     * @method set
     * @description sets the value of element in leaf using ita position
     * @similiar \<Array\>[index] = value
     * @param  {number} index index in the Leaf
     * @param  {any} value value of that index
     * @returns {void} void
     */
    set(index, value) {
        this.data[index] = value;
    }
}
exports.Leaf = Leaf;
//# sourceMappingURL=leaf.js.map