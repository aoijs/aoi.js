import { Async } from "../../typings/types/Async";
export default function <T>(iterator: IterableIterator<T>, cb: (value: T) => Async<void>): Promise<void>;
//# sourceMappingURL=iterate.d.ts.map