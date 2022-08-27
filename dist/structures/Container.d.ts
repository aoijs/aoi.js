import { ContainerData } from "../typings/interfaces/ContainerData";
import { Option } from "../typings/types/Option";
import { Sendable } from "../typings/types/Sendable";
export declare class Container {
    #private;
    channel: Option<Sendable>;
    data: ContainerData;
    constructor();
    setChannel(ch: this["channel"]): this;
    reset(): void;
    send<T>(content?: Option<string>, channel?: Option<Sendable>): Promise<Option<T>>;
    /**
     *
     * @param src
     * @returns The source.
     */
    copyTo(src: Container): Container;
}
//# sourceMappingURL=Container.d.ts.map