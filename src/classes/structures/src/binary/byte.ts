export class Byte {
	name: string;
	size: number;
	data: Array<string>;
	type: "string" | "number";
	constructor(name: string, type: "string" | "number", size: number) {
		this.name = name;
		this.size = size;
		this.type = type;
		this.data = type === "string" ? [] : type === "number" ? ["00"] : [];
	}
}
