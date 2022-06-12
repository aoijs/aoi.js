import { Group } from "./group";
import StructureError from "../error/StructureErrors";
import { LimitGroupOptions } from "./typeDefs";

export class LimitGroup<K = any, V = any> {
  data: Group<K, V>;
  _options: LimitGroupOptions;
  constructor(
    data: Iterable<readonly [K, V]>,
    options: LimitGroupOptions = {
      limit: Infinity,
      sweepOptions: {
        sweepMessages: true,
        afterMethod: "limitCross",
      },
    },
  ) {
    this.data = new Group<K, V>(data);
    this._options = options;
  }
  /**
   * @method size
   * @readonly
   * @similiar Map.size
   * @returns {number}
   */
  public get size(): number {
    return this.data.size;
  }
  /**
   * @method set
   * @param {K} key
   * @param {V} value
   * @similiar Map.set
   * @returns {void}
   */
  public set(key: K, value: V): void {
    if (this._options.limit <= this.size) {
      StructureError.LimitGroupError(
        "LimitExceedError",
        "set",
        "Cannot add the data because it exceeds the provided limit",
      );
    } else if (
      this._options.limit <= this.size &&
      this._options.sweepOptions.afterMethod === "limitCross"
    ) {
      this.shift();
      this.data.set(key, value);
    } else {
      this.data.set(key, value);
    }
  }
  /**
   * @method get
   * @param {K} key
   * @similiar Map.get
   * @returns {V}
   */
  public get(key: K) {
    return this.data.get(key);
  }
  /**
   * @method delete
   * @param {K} key
   * @similiar Map.delete
   * @returns {boolean}
   */
  public delete(key: K): boolean {
    return this.data.delete(key);
  }
  /**
   * @method clear
   * @similiar Map.clear
   * @returns {void}
   */
  public clear(): void {
    return this.data.clear();
  }
  /**
   * @method has
   * @param {K} key
   * @similiar Map.has
   * @returns {boolean}
   */
  public has(key: K): boolean {
    return this.data.has(key);
  }
  /**
   * @method find
   * @similiar Array.find
   * @param func Function to be passed for finding the value.
   * @return V
   */
  public find(func: (value: V, key: K, grp: this) => boolean) {
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
  public filterArray(func: (value: V) => boolean): V[] {
    return this.allValues().filter(func);
  }
  /**
   * @method allValues
   * @return V[]    */
  public allValues(): V[] {
    return [...this.data.values()];
  }
  /**
   * @method allKeys
   * @return K[]
   */
  public allKeys(): K[] {
    return [...this.data.keys()];
  }
  /**
   * @method sortViaKeys
   * @description sorts the group via key
   * @similiar Array.sort() ( for string typed keys && any typed keys) and Array.sort((a,b) => a-b) (for number typed keys)
   * @return Group
   */
  public sortViaKeys(): Group<K, V> {
    const entries = [...this.data.entries()];
    return new Group(
      entries.sort((a, b) => {
        if (a[0] < b[0]) return 1;
        else if (a[0] > b[0]) return -1;
        else return 0;
      }),
    );
  }
  /**
   * @method weakSort
   * @description sorts the Group via Js Sort method //
   * @similiar Array.sort()
   * @return Group
   */
  public weakSort(): Group<K, V> {
    return new Group([...this.data.entries()].sort());
  }
  /**
   * @method filter
   * @description filters the Group
   * @similiar Array.filter
   * @param func Function for filtering the Group
   * @return Group
   */
  public filter(
    func: (value: V, key: K, grp: this) => boolean,
  ): Group<any, any> {
    const g = new Group();
    for (const [key, value] of this.data) {
      if (func(value, key, this)) g.set(key, value);
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
  public top(number = 1) {
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
  public sort(compareFunction: (a: V, b: V) => number): Group {
    const entries = [...this.data.entries()];
    const sorted = entries.sort((a, b) => compareFunction(a[1], b[1]));
    return new Group(sorted);
  }
  /**
   * @method object
   * @description returns Group as an Object
   * @similiar Object
   * @return Object
   */
  public object(): object {
    const obj: Record<string, any> = {};
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
  public bottom(number = 1): V | V[] {
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
  public topKey(number = 1) {
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
  public bottomKey(number = 1): K | K[] {
    const arr = this.allKeys().slice(-number);
    return arr.length === 1 ? arr[0] : arr;
  }
  /**
   * @method random
   * @description returns a random value / array of random values
   * @param number number of random values to be returned
   * @return V | V[]
   */
  public random(number = 1): V | V[] {
    const vals = this.allValues();
    if (number === 1) {
      const random = Math.floor(Math.random() * vals.length - 1);
      return vals[random];
    } else {
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
  public randomKey(number = 1): K | K[] {
    const vals = this.allKeys();
    if (number === 1) {
      const random = Math.floor(Math.random() * vals.length - 1);
      return vals[random];
    } else {
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
  public getByPosition(position: number): V {
    return this.allValues()[position - 1];
  }
  /**
   * @method break
   * @description divides and return Group into 2 different Groups according to the Function Provided
   * @param func function according to which Group is to breaked into
   * @return [ trueGroup,falseGroup]
   */
  public break(func: (val: V, key: K, grp: this) => boolean): [Group, Group] {
    const trueGrp = new Group();
    const falseGrp = new Group();

    for (const [key, value] of this.data) {
      if (func(value, key, this)) trueGrp.set(key, value);
      else falseGrp.set(key, value);
    }
    return [trueGrp, falseGrp];
  }
  /**
   * @method reverse
   * @description returns the Group in reversed order
   * @similiar Array.reverse()
   * @return Group<K,V>
   */
  public reverse(): Group<K, V> {
    const entries = [...this.data.entries()];
    return new Group(entries.reverse());
  }
  /**
   * @method concat
   * @description concats provided array of Groups
   * @similiar Array.concat
   * @param grps Array of Group
   * @return Group<any,any>
   */
  public concat(...grps: Group[]): Group<any, any> {
    const grp = new Group();
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
  public some(func: (val: V) => boolean): boolean {
    return this.allValues().some(func);
  }
  /**
   * @method every
   * @description whether Group fulfill the given condition
   * @similiar Array.every()
   * @param func condition to check
   * @return boolean
   */
  public every(func: (val: V) => boolean): boolean {
    return this.allValues().every(func);
  }
  /**
   * @method someKey
   * @description whether Group fulfill the given condition
   * @similiar Array.some()
   * @param func condition to check
   * @return boolean
   */
  public someKey(func: (val: K) => boolean): boolean {
    return this.allKeys().some(func);
  }
  /**
   * @method everyKey
   * @description whether Group fulfill the given condition
   * @similiar Array.every()
   * @param func condition to check
   * @return boolean
   */
  public everyKey(func: (val: K) => boolean): boolean {
    return this.allKeys().every(func);
  }
  /**
   * @method remove
   * @description removes the key-value pairs that fulfill the provided condition
   * @param func condition thats need to be true for a key-value pair to be removed
   * @return data removed size
   */
  public remove(func: (val: V, key: K, grp: Group) => boolean): number {
    const oldSize = this.data.size;

    for (const [key, value] of this.data) {
      if (func(value, key, this.data)) this.data.delete(key);
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
  public toJSON(
    replacer?: (this: any, key: string, value: any) => any,
    space = 2,
  ): string {
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
  public binarySearch(
    value: string | number,
    valueProp?: string,
    sort = true,
  ): V | void {
    const vals = this.allValues();

    if (sort) {
      vals.sort((a, b) => {
        if (a < b) return 1;
        else if (a > b) return -1;
        else return 0;
      });
    }

    const fn = (search: string | number) => {
      let found = false;
      let start = 0;
      let end = vals.length - 1;
      let val;

      while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        const vm = eval(valueProp ? `vals[ mid ]?.${valueProp}` : `vals[mid]`);
        if (search > vm) start = mid + 1;
        else if (search < vm) end = mid - 1;
        else found = true;

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
  public clone(grp: Group): Group {
    return new Group(grp);
  }
  /**
   * @method removeRandom
   * @description removes a random Data from Group
   * @return void
   */
  public removeRandom(): void {
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
  public map<U>(func: (val: V, key: K, grp: this) => U): U[] {
    let res: U[] = [];
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
  public slice(from = 1, to = 2): Group<K, V> {
    return new Group([...this.data.entries()].slice(from - 1, to - 1));
  }
  /**
   * @method pop
   * @description removes the last data
   * @similiar Array.pop()
   * @return V
   */
  public pop() {
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
  public shift() {
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
  public reduce(
    func: (preVal: V, curVal: V, curKey: K, grp: this) => V,
    intVal?: V,
  ) {
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
  public reduceRight(
    func: (preVal: V, curVal: V, curKey: K, grp: this) => V,
    intVal?: V,
  ) {
    const entries = [...this.entries()];
    let pref = intVal;
    let i = this.size;
    while (i-- > 0) {
      if (pref === undefined) {
        pref = entries[i][1];
      } else {
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
  public reduceArray(
    func: (preVal: V, curVal: V, curIndex: number, array: V[]) => V,
    intVal?: V,
  ) {
    if (!intVal) return this.allValues().reduce(func);
    else return this.allValues().reduce(func, intVal);
  }
  /**
   * @method reduceRightArray
   * @description reduces the values in Group returned by the function
   * @similiar Array.reduceRight()
   * @param func ompareFunction function to reduce the data
   * @param intVal intial data
   * @return V
   */
  public reduceRightArray(
    func: (preVal: V, curVal: V, curIndex: number, array: V[]) => V,
    intVal?: V,
  ) {
    if (!intVal) return this.allValues().reduceRight(func);
    else return this.allValues().reduceRight(func, intVal);
  }
  /**
   * @method position
   * @description returns position of the key in Group
   * @similiar Array.indexOf()
   * @param key Key in the Group
   * @return number
   */
  public position(key: K): number {
    return this.allKeys().indexOf(key) + 1;
  }
  /**
   * @method findPosition
   * @description finds the position of the data in Group
   * @similiar Array.findIndex()
   * @param func function to find position
   * @return number
   */
  public findPosition(func: (value: V, key: K, grp: this) => boolean) {
    let i = 1;
    let res = 0;
    for (const [key, value] of this.data) {
      if (func(value, key, this)) {
        break;
        res = i;
      } else i++;
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
  public removeAlternate(offset = 0, alternate = 1) {
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
  public async asyncMap<U>(
    func: (val: V, key: K, grp: this) => U,
  ): Promise<U[]> {
    const res: U[] = [];
    for (const [key, value] of this.data) {
      res.push(func(value, key, this));
    }
    return res;
  }
}
