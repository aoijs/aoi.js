import { Group } from "../../src/group/group";
import { LimitGroupOptions } from "../../src/group/typeDefs";
export declare class LimitGroup<K = any, V = any> {
    data: Group<K, V>;
    _options: LimitGroupOptions;
    constructor(data: Iterable<readonly [K, V]>, options?: LimitGroupOptions);
    /**
     * @method size
     * @readonly
     * @similiar Map.size
     * @returns {number}
     */
    get size(): number;
    /**
     * @method set
     * @param {K} key
     * @param {V} value
     * @similiar Map.set
     * @returns {void}
     */
    set(key: K, value: V): void;
    /**
     * @method get
     * @param {K} key
     * @similiar Map.get
     * @returns {V}
     */
    get(key: K): V | undefined;
    /**
     * @method delete
     * @param {K} key
     * @similiar Map.delete
     * @returns {boolean}
     */
    delete(key: K): boolean;
    /**
     * @method clear
     * @similiar Map.clear
     * @returns {void}
     */
    clear(): void;
    /**
     * @method has
     * @param {K} key
     * @similiar Map.has
     * @returns {boolean}
     */
    has(key: K): boolean;
    /**
     * @method find
     * @similiar Array.find
     * @param func Function to be passed for finding the value.
     * @return V
     */
    find(func: (value: V, key: K, grp: this) => boolean): V | undefined;
    /**
     * @method filterArray
     * @similiar Array.filter()
     * @param func Function to be passed for filtering data.
     * @return V[]
     */
    filterArray(func: (value: V) => boolean): V[];
    /**
     * @method allValues
     * @return V[]    */
    allValues(): V[];
    /**
     * @method allKeys
     * @return K[]
     */
    allKeys(): K[];
    /**
     * @method sortViaKeys
     * @description sorts the group via key
     * @similiar Array.sort() ( for string typed keys && any typed keys) and Array.sort((a,b) => a-b) (for number typed keys)
     * @return Group
     */
    sortViaKeys(): Group<K, V>;
    /**
     * @method weakSort
     * @description sorts the Group via Js Sort method //
     * @similiar Array.sort()
     * @return Group
     */
    weakSort(): Group<K, V>;
    /**
     * @method filter
     * @description filters the Group
     * @similiar Array.filter
     * @param func Function for filtering the Group
     * @return Group
     */
    filter(func: (value: V, key: K, grp: this) => boolean): Group<any, any>;
    /**
     * @method top
     * @description returns the first value of Group
     * @similiar Array[ 0 ] | Array.slice( 0,number )
     * @param number how many top values to be returned
     * @return V | V[]
     */
    top(number?: number): V | V[];
    /**
     * @method sort
     * @description sorts the Group  using its Value
     * @similiar Array.sort()
     * @param compareFunction Function to sort
     * @return Group
     */
    sort(compareFunction: (a: V, b: V) => number): Group;
    /**
     * @method object
     * @description returns Group as an Object
     * @similiar Object
     * @return Object
     */
    object(): object;
    /**
     * @method bottom
     * @description returns the last Value of Group
     * @similiar Array[ Array.length - 1 ] | Array.slice(-number)
     * @param number number of values to be returned
     * @return V | V[]
     */
    bottom(number?: number): V | V[];
    /**
     * @method topKey
     * @description returns the (first Key/Arrays of first n keys) of Group
     * @similiar Array[ 0 ] | Array.slice( 0,number )
     * @param number how many top keys to be returned
     * @return K | K[]
     */
    topKey(number?: number): K | K[];
    /**
     * @method bottomKey
     * @description returns the last key of Group
     * @similiar Array[ Array.length - 1 ] | Array.slice(-number)
     * @param number number of key to be returned
     * @return K | K[]
     */
    bottomKey(number?: number): K | K[];
    /**
     * @method random
     * @description returns a random value / array of random values
     * @param number number of random values to be returned
     * @return V | V[]
     */
    random(number?: number): V | V[];
    /**
     * @method randomKey
     * @description returns a random key / array of random keys
     * @param number number of random keys to be returned
     * @return K | K[]
     */
    randomKey(number?: number): K | K[];
    /**
     * @method getByPosition
     * @description get Value by its position in Group
     * @similiar Array[ n - 1 ]
     * @param position position of Value tp be returned
     * @return V
     */
    getByPosition(position: number): V;
    /**
     * @method break
     * @description divides and return Group into 2 different Groups according to the Function Provided
     * @param func function according to which Group is to breaked into
     * @return [ trueGroup,falseGroup]
     */
    break(func: (val: V, key: K, grp: this) => boolean): [Group, Group];
    /**
     * @method reverse
     * @description returns the Group in reversed order
     * @similiar Array.reverse()
     * @return Group<K,V>
     */
    reverse(): Group<K, V>;
    /**
     * @method concat
     * @description concats provided array of Groups
     * @similiar Array.concat
     * @param grps Array of Group
     * @return Group<any,any>
     */
    concat(...grps: Group[]): Group<any, any>;
    /**
     * @method some
     * @description whether Group fulfill the given condition
     * @similiar Array.some()
     * @param func condition to check
     * @return boolean
     */
    some(func: (val: V) => boolean): boolean;
    /**
     * @method every
     * @description whether Group fulfill the given condition
     * @similiar Array.every()
     * @param func condition to check
     * @return boolean
     */
    every(func: (val: V) => boolean): boolean;
    /**
     * @method someKey
     * @description whether Group fulfill the given condition
     * @similiar Array.some()
     * @param func condition to check
     * @return boolean
     */
    someKey(func: (val: K) => boolean): boolean;
    /**
     * @method everyKey
     * @description whether Group fulfill the given condition
     * @similiar Array.every()
     * @param func condition to check
     * @return boolean
     */
    everyKey(func: (val: K) => boolean): boolean;
    /**
     * @method remove
     * @description removes the key-value pairs that fulfill the provided condition
     * @param func condition thats need to be true for a key-value pair to be removed
     * @return data removed size
     */
    remove(func: (val: V, key: K, grp: Group) => boolean): number;
    /**
     * @method toJSON
     * @description returns Group as JSON
     * @similiar JSON.stringify()
     * @param replacer same as JSON.stringify
     * @param space same as JSON.stringify
     * @return string
     */
    toJSON(replacer?: (this: any, key: string, value: any) => any, space?: number): string;
    /**
     * @method binarySearch
     * @description searchs for a Value via Binary search
     * @similiar BinarySearch
     * @param value value to be searched
     * @param valueProp property to be searched in
     * @param sort whether to sort the Group before Searching
     * @return V | void
     */
    binarySearch(value: string | number, valueProp?: string, sort?: boolean): V | void;
    /**
     * @method clone
     * @description clones a Group
     * @param grp : Group to be cloned
     * @return Group
     */
    clone(grp: Group): Group;
    /**
     * @method removeRandom
     * @description removes a random Data from Group
     * @return void
     */
    removeRandom(): void;
    /**
     * @method map
     * @description maps a function Over the Group
     * @similiar Array.map()
     * @param func Function to be mapped
     * @return U[]
     */
    map<U>(func: (val: V, key: K, grp: this) => U): U[];
    /**
     * @method slice
     * @description slice the Group and returns a copy of new Group
     * @similiar Array.slice()
     * @param from position of Data in Group to be sliced from. default is 1
     * @param to position of Data  in Group to be sliced to.
     * @return Group<K,V>
     */
    slice(from?: number, to?: number): Group<K, V>;
    /**
     * @method pop
     * @description removes the last data
     * @similiar Array.pop()
     * @return V
     */
    pop(): V | undefined;
    /**
     * @method shift
     * @description removes the firt data
     * @similiar Array.shfit()
     * @return V
     */
    shift(): V | undefined;
    /**
     * @method reduce
     * @description reduces the data in Group returned by the function
     * @similiar Array.reduce()
     * @param func function to reduce the data
     * @param intVal intial data
     * @return V
     */
    reduce(func: (preVal: V, curVal: V, curKey: K, grp: this) => V, intVal?: V): V | undefined;
    /**
     * @method reduceRight
     * @description reduces the data in Group returned by the function from right to left
     * @similiar Array.reduceRight()
     * @param func function to reduce the data
     * @param intVal intial data
     * @return V
     */
    reduceRight(func: (preVal: V, curVal: V, curKey: K, grp: this) => V, intVal?: V): V | undefined;
    entries(): IterableIterator<[K, V]>;
    /**
     * @method reduceArray
     * @description reduces the values in Group returned by the function
     * @similiar Array.reduce()
     * @param func ompareFunction function to reduce the data
     * @param intVal intial data
     * @return V
     */
    reduceArray(func: (preVal: V, curVal: V, curIndex: number, array: V[]) => V, intVal?: V): V;
    /**
     * @method reduceRightArray
     * @description reduces the values in Group returned by the function
     * @similiar Array.reduceRight()
     * @param func ompareFunction function to reduce the data
     * @param intVal intial data
     * @return V
     */
    reduceRightArray(func: (preVal: V, curVal: V, curIndex: number, array: V[]) => V, intVal?: V): V;
    /**
     * @method position
     * @description returns position of the key in Group
     * @similiar Array.indexOf()
     * @param key Key in the Group
     * @return number
     */
    position(key: K): number;
    /**
     * @method findPosition
     * @description finds the position of the data in Group
     * @similiar Array.findIndex()
     * @param func function to find position
     * @return number
     */
    findPosition(func: (value: V, key: K, grp: this) => boolean): number;
    /**
     * @method removeAlternate
     * @description removes alternate data from Group
     * @param offset offset the removal of first data
     * @param alternate alternate gap
     * @return void
     */
    removeAlternate(offset?: number, alternate?: number): void;
    /**
     * @method asyncMap
     * @description map over the data asynchriously
     * @param  {(val:V,key:K,grp:this)=>U} func function to be mapped
     * @returns Promise
     */
    asyncMap<U>(func: (val: V, key: K, grp: this) => U): Promise<U[]>;
}
//# sourceMappingURL=limitGroup.d.ts.map