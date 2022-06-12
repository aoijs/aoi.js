"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitGroup = void 0;
const group_1 = require("./group");
const StructureErrors_1 = __importDefault(require("../error/StructureErrors"));
class LimitGroup {
    data;
    _options;
    constructor(data, options = {
        limit: Infinity,
        sweepOptions: {
            sweepMessages: true,
            afterMethod: "limitCross",
        },
    }) {
        this.data = new group_1.Group(data);
        this._options = options;
    }
    /**
     * @method size
     * @readonly
     * @similiar Map.size
     * @returns {number}
     */
    get size() {
        return this.data.size;
    }
    /**
     * @method set
     * @param {K} key
     * @param {V} value
     * @similiar Map.set
     * @returns {void}
     */
    set(key, value) {
        if (this._options.limit <= this.size) {
            StructureErrors_1.default.LimitGroupError("LimitExceedError", "set", "Cannot add the data because it exceeds the provided limit");
        }
        else if (this._options.limit <= this.size &&
            this._options.sweepOptions.afterMethod === "limitCross") {
            this.shift();
            this.data.set(key, value);
        }
        else {
            this.data.set(key, value);
        }
    }
    /**
     * @method get
     * @param {K} key
     * @similiar Map.get
     * @returns {V}
     */
    get(key) {
        return this.data.get(key);
    }
    /**
     * @method delete
     * @param {K} key
     * @similiar Map.delete
     * @returns {boolean}
     */
    delete(key) {
        return this.data.delete(key);
    }
    /**
     * @method clear
     * @similiar Map.clear
     * @returns {void}
     */
    clear() {
        return this.data.clear();
    }
    /**
     * @method has
     * @param {K} key
     * @similiar Map.has
     * @returns {boolean}
     */
    has(key) {
        return this.data.has(key);
    }
    /**
     * @method find
     * @similiar Array.find
     * @param func Function to be passed for finding the value.
     * @return V
     */
    find(func) {
        for (const [key, value] of this.data) {
            if (func(value, key, this)) {
                return value;
                break;
            }
        }
    }
    /**
     * @method filterArray
     * @similiar Array.filter()
     * @param func Function to be passed for filtering data.
     * @return V[]
     */
    filterArray(func) {
        return this.allValues().filter(func);
    }
    /**
     * @method allValues
     * @return V[]    */
    allValues() {
        return [...this.data.values()];
    }
    /**
     * @method allKeys
     * @return K[]
     */
    allKeys() {
        return [...this.data.keys()];
    }
    /**
     * @method sortViaKeys
     * @description sorts the group via key
     * @similiar Array.sort() ( for string typed keys && any typed keys) and Array.sort((a,b) => a-b) (for number typed keys)
     * @return Group
     */
    sortViaKeys() {
        const entries = [...this.data.entries()];
        return new group_1.Group(entries.sort((a, b) => {
            if (a[0] < b[0])
                return 1;
            else if (a[0] > b[0])
                return -1;
            else
                return 0;
        }));
    }
    /**
     * @method weakSort
     * @description sorts the Group via Js Sort method //
     * @similiar Array.sort()
     * @return Group
     */
    weakSort() {
        return new group_1.Group([...this.data.entries()].sort());
    }
    /**
     * @method filter
     * @description filters the Group
     * @similiar Array.filter
     * @param func Function for filtering the Group
     * @return Group
     */
    filter(func) {
        const g = new group_1.Group();
        for (const [key, value] of this.data) {
            if (func(value, key, this))
                g.set(key, value);
        }
        return g;
    }
    /**
     * @method top
     * @description returns the first value of Group
     * @similiar Array[ 0 ] | Array.slice( 0,number )
     * @param number how many top values to be returned
     * @return V | V[]
     */
    top(number = 1) {
        const arr = this.allValues().slice(0, number);
        return arr.length === 1 ? arr[0] : arr;
    }
    /**
     * @method sort
     * @description sorts the Group  using its Value
     * @similiar Array.sort()
     * @param compareFunction Function to sort
     * @return Group
     */
    sort(compareFunction) {
        const entries = [...this.data.entries()];
        const sorted = entries.sort((a, b) => compareFunction(a[1], b[1]));
        return new group_1.Group(sorted);
    }
    /**
     * @method object
     * @description returns Group as an Object
     * @similiar Object
     * @return Object
     */
    object() {
        const obj = {};
        for (const [key, value] of this.data) {
            obj[`${key}`] = value;
        }
        return obj;
    }
    /**
     * @method bottom
     * @description returns the last Value of Group
     * @similiar Array[ Array.length - 1 ] | Array.slice(-number)
     * @param number number of values to be returned
     * @return V | V[]
     */
    bottom(number = 1) {
        const arr = this.allValues().slice(-number);
        return arr.length === 1 ? arr[0] : arr;
    }
    /**
     * @method topKey
     * @description returns the (first Key/Arrays of first n keys) of Group
     * @similiar Array[ 0 ] | Array.slice( 0,number )
     * @param number how many top keys to be returned
     * @return K | K[]
     */
    topKey(number = 1) {
        const arr = this.allKeys().slice(0, number);
        return arr.length === 1 ? arr[0] : arr;
    }
    /**
     * @method bottomKey
     * @description returns the last key of Group
     * @similiar Array[ Array.length - 1 ] | Array.slice(-number)
     * @param number number of key to be returned
     * @return K | K[]
     */
    bottomKey(number = 1) {
        const arr = this.allKeys().slice(-number);
        return arr.length === 1 ? arr[0] : arr;
    }
    /**
     * @method random
     * @description returns a random value / array of random values
     * @param number number of random values to be returned
     * @return V | V[]
     */
    random(number = 1) {
        const vals = this.allValues();
        if (number === 1) {
            const random = Math.floor(Math.random() * vals.length - 1);
            return vals[random];
        }
        else {
            const res = [];
            for (number; number > 0; number--) {
                const random = Math.floor(Math.random() * vals.length - 1);
                res.push(vals[random]);
            }
            return res;
        }
    }
    /**
     * @method randomKey
     * @description returns a random key / array of random keys
     * @param number number of random keys to be returned
     * @return K | K[]
     */
    randomKey(number = 1) {
        const vals = this.allKeys();
        if (number === 1) {
            const random = Math.floor(Math.random() * vals.length - 1);
            return vals[random];
        }
        else {
            const res = [];
            for (number; number > 0; number--) {
                const random = Math.floor(Math.random() * vals.length - 1);
                res.push(vals[random]);
            }
            return res;
        }
    }
    /**
     * @method getByPosition
     * @description get Value by its position in Group
     * @similiar Array[ n - 1 ]
     * @param position position of Value tp be returned
     * @return V
     */
    getByPosition(position) {
        return this.allValues()[position - 1];
    }
    /**
     * @method break
     * @description divides and return Group into 2 different Groups according to the Function Provided
     * @param func function according to which Group is to breaked into
     * @return [ trueGroup,falseGroup]
     */
    break(func) {
        const trueGrp = new group_1.Group();
        const falseGrp = new group_1.Group();
        for (const [key, value] of this.data) {
            if (func(value, key, this))
                trueGrp.set(key, value);
            else
                falseGrp.set(key, value);
        }
        return [trueGrp, falseGrp];
    }
    /**
     * @method reverse
     * @description returns the Group in reversed order
     * @similiar Array.reverse()
     * @return Group<K,V>
     */
    reverse() {
        const entries = [...this.data.entries()];
        return new group_1.Group(entries.reverse());
    }
    /**
     * @method concat
     * @description concats provided array of Groups
     * @similiar Array.concat
     * @param grps Array of Group
     * @return Group<any,any>
     */
    concat(...grps) {
        const grp = new group_1.Group();
        const res = grps.map((x) => {
            for (const [key, value] of this.data) {
                grp.set(key, value);
            }
        });
        return grp;
    }
    /**
     * @method some
     * @description whether Group fulfill the given condition
     * @similiar Array.some()
     * @param func condition to check
     * @return boolean
     */
    some(func) {
        return this.allValues().some(func);
    }
    /**
     * @method every
     * @description whether Group fulfill the given condition
     * @similiar Array.every()
     * @param func condition to check
     * @return boolean
     */
    every(func) {
        return this.allValues().every(func);
    }
    /**
     * @method someKey
     * @description whether Group fulfill the given condition
     * @similiar Array.some()
     * @param func condition to check
     * @return boolean
     */
    someKey(func) {
        return this.allKeys().some(func);
    }
    /**
     * @method everyKey
     * @description whether Group fulfill the given condition
     * @similiar Array.every()
     * @param func condition to check
     * @return boolean
     */
    everyKey(func) {
        return this.allKeys().every(func);
    }
    /**
     * @method remove
     * @description removes the key-value pairs that fulfill the provided condition
     * @param func condition thats need to be true for a key-value pair to be removed
     * @return data removed size
     */
    remove(func) {
        const oldSize = this.data.size;
        for (const [key, value] of this.data) {
            if (func(value, key, this.data))
                this.data.delete(key);
        }
        return this.data.size - oldSize;
    }
    /**
     * @method toJSON
     * @description returns Group as JSON
     * @similiar JSON.stringify()
     * @param replacer same as JSON.stringify
     * @param space same as JSON.stringify
     * @return string
     */
    toJSON(replacer, space = 2) {
        return JSON.stringify(this.object(), replacer, space);
    }
    /**
     * @method binarySearch
     * @description searchs for a Value via Binary search
     * @similiar BinarySearch
     * @param value value to be searched
     * @param valueProp property to be searched in
     * @param sort whether to sort the Group before Searching
     * @return V | void
     */
    binarySearch(value, valueProp, sort = true) {
        const vals = this.allValues();
        if (sort) {
            vals.sort((a, b) => {
                if (a < b)
                    return 1;
                else if (a > b)
                    return -1;
                else
                    return 0;
            });
        }
        const fn = (search) => {
            let found = false;
            let start = 0;
            let end = vals.length - 1;
            let val;
            while (start <= end) {
                const mid = Math.floor((start + end) / 2);
                const vm = eval(valueProp ? `vals[ mid ]?.${valueProp}` : `vals[mid]`);
                if (search > vm)
                    start = mid + 1;
                else if (search < vm)
                    end = mid - 1;
                else
                    found = true;
                if (found) {
                    break;
                    val = vals[mid];
                }
            }
            return val;
        };
        return fn(value);
    }
    /**
     * @method clone
     * @description clones a Group
     * @param grp : Group to be cloned
     * @return Group
     */
    clone(grp) {
        return new group_1.Group(grp);
    }
    /**
     * @method removeRandom
     * @description removes a random Data from Group
     * @return void
     */
    removeRandom() {
        const random = Math.floor(Math.random() * (this.data.size - 1));
        const keys = this.allKeys();
        this.data.delete(keys[random]);
    }
    /**
     * @method map
     * @description maps a function Over the Group
     * @similiar Array.map()
     * @param func Function to be mapped
     * @return U[]
     */
    map(func) {
        let res = [];
        for (const [key, value] of this.data) {
            res.push(func(value, key, this));
        }
        return res;
    }
    /**
     * @method slice
     * @description slice the Group and returns a copy of new Group
     * @similiar Array.slice()
     * @param from position of Data in Group to be sliced from. default is 1
     * @param to position of Data  in Group to be sliced to.
     * @return Group<K,V>
     */
    slice(from = 1, to = 2) {
        return new group_1.Group([...this.data.entries()].slice(from - 1, to - 1));
    }
    /**
     * @method pop
     * @description removes the last data
     * @similiar Array.pop()
     * @return V
     */
    pop() {
        const keys = this.allKeys();
        const data = this.data.get(keys[this.data.size - 1]);
        this.data.delete(keys[this.data.size - 1]);
        return data;
    }
    /**
     * @method shift
     * @description removes the firt data
     * @similiar Array.shfit()
     * @return V
     */
    shift() {
        const keys = this.allKeys();
        const data = this.get(keys[0]);
        this.delete(keys[0]);
        return data;
    }
    /**
     * @method reduce
     * @description reduces the data in Group returned by the function
     * @similiar Array.reduce()
     * @param func function to reduce the data
     * @param intVal intial data
     * @return V
     */
    reduce(func, intVal) {
        let pref = intVal;
        for (const [key, value] of this.data) {
            if (pref === undefined) {
                pref = value;
                continue;
            }
            pref = func(pref, value, key, this);
        }
        return pref;
    }
    /**
     * @method reduceRight
     * @description reduces the data in Group returned by the function from right to left
     * @similiar Array.reduceRight()
     * @param func function to reduce the data
     * @param intVal intial data
     * @return V
     */
    reduceRight(func, intVal) {
        const entries = [...this.entries()];
        let pref = intVal;
        let i = this.size;
        while (i-- > 0) {
            if (pref === undefined) {
                pref = entries[i][1];
            }
            else {
                pref = func(pref, entries[i][1], entries[i][0], this);
            }
        }
        return pref;
    }
    entries() {
        return this.data.entries();
    }
    /**
     * @method reduceArray
     * @description reduces the values in Group returned by the function
     * @similiar Array.reduce()
     * @param func ompareFunction function to reduce the data
     * @param intVal intial data
     * @return V
     */
    reduceArray(func, intVal) {
        if (!intVal)
            return this.allValues().reduce(func);
        else
            return this.allValues().reduce(func, intVal);
    }
    /**
     * @method reduceRightArray
     * @description reduces the values in Group returned by the function
     * @similiar Array.reduceRight()
     * @param func ompareFunction function to reduce the data
     * @param intVal intial data
     * @return V
     */
    reduceRightArray(func, intVal) {
        if (!intVal)
            return this.allValues().reduceRight(func);
        else
            return this.allValues().reduceRight(func, intVal);
    }
    /**
     * @method position
     * @description returns position of the key in Group
     * @similiar Array.indexOf()
     * @param key Key in the Group
     * @return number
     */
    position(key) {
        return this.allKeys().indexOf(key) + 1;
    }
    /**
     * @method findPosition
     * @description finds the position of the data in Group
     * @similiar Array.findIndex()
     * @param func function to find position
     * @return number
     */
    findPosition(func) {
        let i = 1;
        let res = 0;
        for (const [key, value] of this.data) {
            if (func(value, key, this)) {
                break;
                res = i;
            }
            else
                i++;
        }
        return res;
    }
    /**
     * @method removeAlternate
     * @description removes alternate data from Group
     * @param offset offset the removal of first data
     * @param alternate alternate gap
     * @return void
     */
    removeAlternate(offset = 0, alternate = 1) {
        let i = offset;
        const keys = this.allKeys();
        while (i < this.size) {
            this.delete(keys[i]);
            i = +(alternate + 1);
        }
    }
    /**
     * @method asyncMap
     * @description map over the data asynchriously
     * @param  {(val:V,key:K,grp:this)=>U} func function to be mapped
     * @returns Promise
     */
    async asyncMap(func) {
        const res = [];
        for (const [key, value] of this.data) {
            res.push(func(value, key, this));
        }
        return res;
    }
}
exports.LimitGroup = LimitGroup;
//# sourceMappingURL=limitGroup.js.map