export declare type Character = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";
export declare class IndexData {
    letters: Record<Character | string, Array<number>>;
    length: number;
    constructor(word: string);
    /**
     * @method has
     * @description returnds whether a letter exist in the IndexData
     * @param letter letter to be checked
     * @Complexity best : O(1) | worst : O(1)
     * @return boolean
     */
    has(letter: Character): boolean;
    /**
     * @method add
     * @description adds the letter to the Data
     * @param letter letter to be added
     * @Complexity best : O(1) | worst : O(1)
     * @return boolean
     */
    add(letter: Character): number[];
    /**
     * @method remove
     * @description removes the last index of that letter if it exists
     * @param letter letter to be removed
     * @Complexity best : O(1) | worst : O(n)
     * @return new number[]
     */
    remove(letter: Character): number[];
    /**
     * @method entries
     * @description return data as Entries
     * @Complexity best : O(n) | worst : O(n)
     * @return [string,number[]][]
     */
    entries(): [string, number[]][];
    /**
     * @method toString
     * @description Converts the Data into String and returns it
     * @Complexity best : O(n) | worst : O(n^2)
     * @return string
     */
    toString(): string;
    /**
     * @method map
     * @description maps a function over the data and return the resultant array
     * @Complexity best : O(n^2) | worst : O(n^2)
     * @return U[]
     */
    map<U>(func: (indexes: number[], letter: Character | string, Data: this) => U): U[];
    /**
     * @method forEach
     * @description loops a function over the data
     * @Complexity best : O(n^2) | worst : O(n^2)
     * @return void
     */
    forEach(func: (indexes: number[], letter: Character | string, Data: this) => void): void;
    /**
     * @method size
     * @description returns the size of keys
     * @Complexity best : <=O(n) | worst : O(n)
     * @return number
     */
    get size(): number;
    /**
     * @method set
     */
    set(letter: Character, indexes: number[]): number[];
    /**
     * values
     */
    values(): Array<Array<number>>;
}
//# sourceMappingURL=indexData.d.ts.map