import { AoiClient } from "..";
import { RawStatusData } from "../typings/interfaces/StatusData";
export declare class AoiStatusManager {
    #private;
    constructor(bot: AoiClient);
    private start;
    load(directory: string): this;
    add(status: RawStatusData): this;
    add(status: RawStatusData[]): this;
    add(...status: RawStatusData[][]): this;
}
//# sourceMappingURL=AoiStatusManager.d.ts.map