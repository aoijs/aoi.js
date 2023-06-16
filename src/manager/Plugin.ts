import { Plugin } from "../typings/interfaces.js";
import { PluginType, PluginManagerProps } from "../typings/types.js";
import { existsSync } from "fs";
import path from "path";
interface PluginManager extends PluginManagerProps {
    types: PluginType[];
}

class PluginManager {
    constructor() {
        this.types = [
            "pre",
            "post",
            "load",
            "preEvent",
            "postEvent",
            "preCommand",
            "postCommand",
        ];
        this.#bindPlugins();
        this.#load();
    }
    #bindPlugins() {
        for (const type of this.types) {
            this[type] = [] as Plugin[];
        }
    }
    add(plugin: Plugin, type: PluginType) {
        this[type].push(plugin);
    }
    getPlugins(type: PluginType):Plugin[] {
        return this[type];
    }
    getPlugin(name: string, type: PluginType) {
        return this[type].find((p) => p.name === name);
    }

    async #load() {
        if (!existsSync("./aoijs.plugins.js")) return;
        const plugObj = (
            await import(path.join(process.cwd(), "./aoijs.plugins.js"))
        ).default as Record<PluginType, Plugin[]>;

        for (const type of this.types) {
            if (!plugObj[type]) continue;
            for (const plugin of plugObj[type]) {
                this.add(plugin, type);
            }
        }
    }
}

export default PluginManager;
