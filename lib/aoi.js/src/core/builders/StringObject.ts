export default class StringObject {
	parent: StringObject | undefined;
	children: StringObject[];
	start: '{' | '[';
	end?: '}' | ']';
	keys: string[];
	values: string[];
	name: number;
	constructor(start: '{' | '[', parent?: StringObject) {
		this.parent = parent;
		this.name = Math.random() * 999999;
		this.keys = [];
		this.values = [];
		this.start = start;
		this.end = undefined;
		this.children = [];
	}

	addKey(text: string) {
		this.keys.push(text);
	}

	addValue(text: string) {
		this.values.push(text);
	}
	
	addEnd(text: '}' | ']') {
		this.end = text;
	}

	pushChild(child: StringObject) {
		this.children.push(child);
	}

	solve() {
		if (this.children) {
			this.children.forEach((x) => {
				const res = x.solve();
				const index = this.values.indexOf(`#StringObject_${x.name}#`);
				const keyIndex = this.keys.indexOf(`#StringObject_${x.name}#`);
				this.keys[keyIndex] = res;
				this.values[index] = res;
			});
			const keys = this.keys;
			const values = this.values;
			let i = 0;
			let text = '';
			if (this.start === '[') {
				text = values.join(',');
				return `${this.start}${text}${this.end}`;
			}

			while (i < keys.length) {
				text += `${keys[i]} : ${values[i]},`;
				i++;
			}

			text = text.slice(0, text.length - 1);
			return `${this.start}${text}${this.end}`;
		} else {
			const keys = this.keys;
			const values = this.values;
			let i = 0;
			let text = '';
			if (this.start === '[') {
				text = values.join(',');
				return `${this.start}${text}${this.end}`;
			}

			while (i < keys.length) {
				text += `${keys[i]} : ${values[i]},`;
				i++;
			}

			text = text.slice(0, text.length - 1);
			return `${this.start}${text}${this.end}`;
		}
	}
}
