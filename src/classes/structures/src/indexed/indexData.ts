export type Character =
	| "a"
	| "b"
	| "c"
	| "d"
	| "e"
	| "f"
	| "g"
	| "h"
	| "i"
	| "j"
	| "k"
	| "l"
	| "m"
	| "n"
	| "o"
	| "p"
	| "q"
	| "r"
	| "s"
	| "t"
	| "u"
	| "v"
	| "w"
	| "x"
	| "y"
	| "z";

export class IndexData {
	letters!: Record<Character | string, Array<number>>;
	length!: number;

	constructor(word: string) {
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
			} else {
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
	public has(letter: Character): boolean {
		return this.letters[letter] ? true : false;
	}
	/**
	 * @method add
	 * @description adds the letter to the Data
	 * @param letter letter to be added
	 * @Complexity best : O(1) | worst : O(1)
	 * @return boolean
	 */
	public add(letter: Character): number[] {
		let LetterPlaces = this.letters[letter];
		if (!LetterPlaces) this.letters[letter] = [this.length];
		else this.letters[letter].push(this.length);
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
	public remove(letter: Character): number[] {
		if (!this.has(letter)) return [-1];
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
	public entries() {
		return Object.entries(this.letters);
	}
	/**
	 * @method toString
	 * @description Converts the Data into String and returns it
	 * @Complexity best : O(n) | worst : O(n^2)
	 * @return string
	 */
	public toString(): string {
		const string: string[] = [];

		for (const [key, value] of this.entries()) {
			if (value.length === 1) {
				string[value[0]] = key;
			} else {
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
	public map<U>(
		func: (indexes: number[], letter: Character | string, Data: this) => U,
	): U[] {
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
	public forEach(
		func: (indexes: number[], letter: Character | string, Data: this) => void,
	): void {
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
	public get size(): number {
		return Object.keys(this.letters).length;
	}
	/**
	 * @method set
	 */
	public set(letter: Character, indexes: number[]): number[] {
		for (let [key, values] of this.entries()) {
			const res: number[] = [];

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
	public values(): Array<Array<number>> {
		return Object.values(this.letters);
	}
}
