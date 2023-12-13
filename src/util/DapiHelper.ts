import { Message } from "zeneth";
import { AoiClient } from "..";
import { autoFetchDataTypes } from "../typings/types.js";

/**
 * Checks if the autoFetchData is enabled for the given string
 * @param {autoFetchDataTypes} string The string to check
 * @param {AoiClient} client The client
 * @returns {boolean}
 * @example
 * ```js
 * isAutoFetchDataEnabled("messages", client)
 * ```
 */
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

/**
 * Returns the default cache config
 * @example
 * ```js
 * defaultCacheConfig()
 * ```
 */
export function defaultCacheConfig(): {
    messages: {
        class: string;
        cacheFunction: (message: Message) => boolean;
    };
    channels: {
        class: string;
    };
    guilds: {
        class: string;
    };
    } {
    return {
        messages: {
            class: "Message",
            cacheFunction: (message: Message) => !message.author.bot,
        },
        channels: {
            class: "Channel",
        },
        guilds: {
            class: "Guild",
        },
    };
}
