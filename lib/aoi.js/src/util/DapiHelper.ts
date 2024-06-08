import { type Message } from 'zeneth';
import { type AoiClient } from '..';
import { type AutoFetchDataTypes } from '../typings/types.js';

/**
 * Checks if the autoFetchData is enabled for the given string
 * @param string The string to check
 * @param client The client
 * @returns
 * @example
 * ```js
 * isAutoFetchDataEnabled("messages", client)
 * ```
 */
export function isAutoFetchDataEnabled(
	string: AutoFetchDataTypes,
	client: AoiClient,
) {
	if (!string) return false;
	if (
		client.options.autoFetchData?.includes(string) ||
        client.options.autoFetchData?.includes('all')
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
			class: 'Message',
			cacheFunction: (message: Message) => !message.author.bot,
		},
		channels: {
			class: 'Channel',
		},
		guilds: {
			class: 'Guild',
		},
	};
}
