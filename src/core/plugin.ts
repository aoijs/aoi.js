import { PluginOptions } from "../typings/interfaces.js";
import { PluginType } from "../typings/types.js";

export function definePluginConfigs(options:PluginOptions) {
    const { plugins  } = options;

    const obj: Record<PluginType,((...args:unknown[]) => void)[]> = {
        pre: [],
        post: [],
        load: [],
        preEvent: [],
        postEvent: [],
        preCommand: [],
        postCommand: [],
    };
    for(const plugin of plugins) {
        obj[plugin.type] = plugin.plugins.map(p => p.func);
    }

    return obj;
}