export class JsonXYaml {
    obj: Record<string, unknown> = {};
    isInString = false;
    isObject = false;
    hasPotential = false;
    stringLiteralStarted = false;

    constructor(ob: string) {
        ob = ob.trim();
        let temp = "";
        let currentKey = "";
        for (const char of ob) {
            if (char === ":" && !this.isInString && !this.isObject) {
                const key = temp.trim();
                currentKey = key;
                temp = "";
            } else if (
                char === "\n" &&
                !this.isInString &&
                !this.isObject &&
                temp.trim() !== ""
            ) {
                const value = temp.trim();
                this.obj[currentKey] = value;
                temp = "";
                currentKey = "";
            } else if (char === "@" && !this.isInString) {
                this.hasPotential = true;
            } else if (char === "{" && this.hasPotential && !this.isInString) {
                this.isInString = true;
                this.stringLiteralStarted = true;
            } else if (char === "}" && this.isInString && this.hasPotential) {
                this.isInString = false;
                this.obj[currentKey] = `${temp.trim()}`;
                temp = "";
                this.stringLiteralStarted = false;
                this.hasPotential = false;
            } else if (char === "{" && !this.isInString && !this.hasPotential) {
                this.isObject = true;
                temp += char;
            } else if (
                char === "}" &&
                !this.isInString &&
                !this.hasPotential &&
                this.isObject
            ) {
                this.isObject = false;
                temp += char;
                this.obj[currentKey] = new JsonXYaml(
                    temp
                        .trim()
                        .slice(1, temp.length - 1)
                        .trim(),
                ).toObject();
                temp = "";
                currentKey = "";
            } else {
                temp += char;
                if (
                    this.hasPotential &&
                    char !== "{" &&
                    !this.stringLiteralStarted
                ) {
                    this.hasPotential = false;
                }
            }
        }
    }
    toObject() {
        return this.obj;
    }
}