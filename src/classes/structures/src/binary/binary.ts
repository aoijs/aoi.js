import StructureError from "../error/StructureErrors";
import { Byte } from "./byte";

export class Binary {
	size: number;
	data: Record<string, Byte>;
	constructor(size = Infinity) {
		this.size = size;
		this.data = {};
	}
	/**
	 * @method newByte
	 * @description creates A new Byte data
	 * @param name name of the Byte
	 * @param type type of the Byte
	 * @param size size of the Byte
	 * @return Byte
	 */
	public newByte(name: string, type: "string" | "number", size: number): Byte {
		const newByte = new Byte(name, type, size);
		this.data[name] = newByte;
		return newByte;
	}
	/**
	 * @method addByteData
	 * @description adds data to that byte
	 * @param name name of the byte
	 * @param data
	 * @return data
	 */
	public addByteData(name: string, data: string | number): void {
		const byte = this.data[name];
		if (!byte) {
			StructureError.BinaryError(
				"InvalidByteError",
				"addByteData",
				"Invalid Byte name provided",
			);
		}

		const type = byte.type;

		if (type === "string" && typeof data === "string") {
			byte.data = data.split("").map((x) => x.charCodeAt(0).toString(2));
		} else if (type === "number") {
			byte.data = [Number(data).toString(2)];
		}
	}
	/**
	 * @method getRawData
	 * @description gets the raw  data from byte
	 * @param name name of the byte
	 * @return {string | string[]} data
	 */
	public getRawData(name: string): string | string[] {
		const { data, type } = this.data[name];
		if (type === "string") return data;
		else return data[0];
	}
	/**
	 * @method getData
	 * @description gets data from byte
	 * @param name name of the byte
	 * @return {string | number } data
	 */
	public getData(name: string): string | number {
		const byte = this.data[name];
		const type = byte.type;
		if (type === "string") {
			return byte.data
				.map((bin) => String.fromCharCode(parseInt(bin, 2)))
				.join("");
		} else return parseInt(byte.data[0], 2);
	}
}
