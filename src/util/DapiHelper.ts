import { Message } from "aoiluna";
import { AoiClient } from "..";
import { autoFetchDataTypes } from "../typings/types.js";

export function isAutoFetchDataEnabled(
    string: autoFetchDataTypes,
    client: AoiClient,
) {
    if (!string) return false;
    if (
        client.options.autoFetchData?.includes(string) ||
        client.options.autoFetchData?.includes("all")
    )
        return true;
    else return false;
}

export function defaultCacheConfig() {
    return {
        messages: {
            class: "Message",
            cacheFunction: (message: Message ) => !message.author.bot,
        },
        channels: {
            class: "Channel",
        },
        guilds: {
            class: "Guild",
        },
    };
}
