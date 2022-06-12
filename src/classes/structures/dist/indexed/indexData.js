"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexData = void 0;
class IndexData {
    letters;
    length;
    constructor(word) {
        const wordArray = word.split("");
        Object.defineProperty(this, "letters", { value: {} });
        Object.defineProperty(this, "length", {
            value: wordArray.length,
            writable: true,
        });
        wordArray.forEach((x, y) => {
            let LetterIndexes = this.letters[x];
            if (LetterIndexes) {
                LetterIndexes.push(y);
                this.letters[x] = LetterIndexes;
            }
            else {
                LetterIndexes = [y];
                this.letters[x] = LetterIndexes;
            }
        });
    }
    /**
     * @method has
     * @description returnds whether a letter exist in the IndexData
     * @param letter letter to be checked
     * @Complexity best : O(1) | worst : O(1)
     * @return boolean
     */
    has(letter) {
        return this.letters[letter] ? true : false;
    }
    /**
     * @method add
     * @description adds the letter to the Data
     * @param letter letter to be added
     * @Complexity best : O(1) | worst : O(1)
     * @return boolean
     */
    add(letter) {
        let LetterPlaces = this.letters[letter];
        if (!LetterPlaces)
            this.letters[letter] = [this.length];
        else
            this.letters[letter].push(this.length);
        this.length += 1;
        return this.letters[letter];
    }
    /**
     * @method remove
     * @description removes the last index of that letter if it exists
     * @param letter letter to be removed
     * @Complexity best : O(1) | worst : O(n)
     * @return new number[]
     */
    remove(letter) {
        if (!this.has(letter))
            return [-1];
        else {
            const indexes = this.letters[letter];
            indexes.pop();
            this.length -= 1;
            return indexes;
        }
    }
    /**
     * @method entries
     * @description return data as Entries
     * @Complexity best : O(n) | worst : O(n)
     * @return [string,number[]][]
     */
    entries() {
        return Object.entries(this.letters);
    }
    /**
     * @method toString
     * @description Converts the Data into String and returns it
     * @Complexity best : O(n) | worst : O(n^2)
     * @return string
     */
    toString() {
        const string = [];
        for (const [key, value] of this.entries()) {
            if (value.length === 1) {
                string[value[0]] = key;
            }
            else {
                let i = value.length - 1;
                while (i >= 0) {
                    string[value[i]] = key;
                    i--;
                }
            }
        }
        return string.join("");
    }
    /**
     * @method map
     * @description maps a function over the data and return the resultant array
     * @Complexity best : O(n^2) | worst : O(n^2)
     * @return U[]
     */
    map(func) {
        const res = [];
        for (const [key, value] of this.entries()) {
            res.push(func(value, key, this));
        }
        return res;
    }
    /**
     * @method forEach
     * @description loops a function over the data
     * @Complexity best : O(n^2) | worst : O(n^2)
     * @return void
     */
    forEach(func) {
        for (const [key, value] of this.entries()) {
            func(value, key, this);
        }
    }
    /**
     * @method size
     * @description returns the size of keys
     * @Complexity best : <=O(n) | worst : O(n)
     * @return number
     */
    get size() {
        return Object.keys(this.letters).length;
    }
    /**
     * @method set
     */
    set(letter, indexes) {
        for (let [key, values] of this.entries()) {
            const res = [];
            values.forEach((x) => {
                if (!indexes.includes(x)) {
                    res.push(x);
                }
            });
            this.letters[key] = res;
        }
        this.letters[letter] = indexes;
        this.length = this.values()
            .map((x) => x.length)
            .reduce((a, b) => a + b);
        return indexes;
    }
    /**
     * values
     */
    values() {
        return Object.values(this.letters);
    }
}
exports.IndexData = IndexData;
//# sourceMappingURL=indexData.js.map