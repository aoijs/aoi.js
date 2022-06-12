import { Byte } from "../../src/binary/byte";
export declare class Binary {
    size: number;
    data: Record<string, Byte>;
    constructor(size?: number);
    /**
     * @method newByte
     * @description creates A new Byte data
     * @param name name of the Byte
     * @param type type of the Byte
     * @param size size of the Byte
     * @return Byte
     */
    newByte(name: string, type: "string" | "number", size: number): Byte;
    /**
     * @method addByteData
     * @description adds data to that byte
     * @param name name of the byte
     * @param data
     * @return data
     */
    addByteData(name: string, data: string | number): void;
    /**
     * @method getRawData
     * @description gets the raw  data from byte
     * @param name name of the byte
     * @return {string | string[]} data
     */
    getRawData(name: string): string | string[];
    /**
     * @method getData
     * @description gets data from byte
     * @param name name of the byte
     * @return {string | number } data
     */
    getData(name: string): string | number;
}
//# sourceMappingURL=binary.d.ts.map