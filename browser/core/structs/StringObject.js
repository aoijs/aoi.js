export default class StringObject {
    parent;
    children;
    start;
    end;
    keys;
    values;
    name;
    constructor(start, parent) {
        this.parent = parent;
        this.name = Math.random() * 999999;
        this.keys = [];
        this.values = [];
        this.start = start;
        this.end = undefined;
        this.children = [];
    }
    addKey(text) {
        this.keys.push(text);
    }
    addValue(text) {
        this.values.push(text);
    }
    addEnd(text) {
        this.end = text;
    }
    pushChild(child) {
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
            let text = "";
            if (this.start === "[") {
                text = values.join(",");
                return `${this.start}${text}${this.end}`;
            }
            while (i < keys.length) {
                text += `${keys[i]} : ${values[i]},`;
                i++;
            }
            text = text.slice(0, text.length - 1);
            return `${this.start}${text}${this.end}`;
        }
        else {
            const keys = this.keys;
            const values = this.values;
            let i = 0;
            let text = "";
            if (this.start === "[") {
                text = values.join(",");
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
//# sourceMappingURL=StringObject.js.map