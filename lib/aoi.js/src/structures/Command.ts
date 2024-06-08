import { type CommandOptions } from '../typings/interfaces.js';
import { type AsyncFunction, type CommandTypes } from '../typings/types.js';
import { transpiler } from '../core/transpiler.js';
import { type AoiClient } from './AoiClient.js';
import { type Snowflake } from 'zeneth';
export class Command {
	name: string;
	type: CommandTypes;
	code: string | AsyncFunction;
	aliases?: string[];
	channel?: string | Snowflake;
	__path__: string;
	reverseRead?: boolean;
	executeAt?: 'guild' | 'dm' | 'both';
	__compiled__: AsyncFunction;
	[key: string]: unknown;
	constructor(data: CommandOptions, client: AoiClient) {
		this.name = data.name;
		this.type = data.type;
		this.code = data.code;
		this.aliases = data.aliases;
		this.__path__ = data.__path__;
		this.executeAt = data.executeAt ?? 'both';
		this.reverseRead = data.reverseRead ?? false;

		for (const key in data) {
			if (
				![
					'name',
					'type',
					'code',
					'aliases',
					'__path__',
					'executeAt',
					'reverseRead',
				].includes(key)
			)
				this[key] = data[key];
		}

		if (this.code instanceof Function) this.__compiled__ = this.code;
		else {
			let chan: Snowflake | undefined | AsyncFunction;
			if (this.channel) {
				if (
					typeof this.channel === 'string' &&
                    this.channel.startsWith('$')
				) {
					chan = transpiler(this.channel, {
						sendMessage: false,
						minify: true,
						customFunctions:
                            client.managers.functions.functions.toJSON(),
						scopeData: {
							name: 'GLOBAL_CHANNEL',
						},
						client,
					}).func;
				} else if (typeof this.channel === 'string')
					chan = BigInt(this.channel);
				else chan = this.channel;
			}

			const func = transpiler(this.code, {
				sendMessage: true,
				minify: true,
				reverse: this.reverseRead,
				customFunctions: client.managers.functions.functions.toJSON(),
				client,
				scopeData: {
					functions:
                        typeof chan === 'function'
                        	? `${chan.toString()}`
                        	: undefined,
					useChannel:
                        typeof chan === 'function' ? `${chan.name}()` : chan,
				},
			});

			this.__compiled__ = func.func;
		}
	}
}
