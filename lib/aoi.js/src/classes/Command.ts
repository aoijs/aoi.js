import { type AsyncFunction, type CommandTypes } from '@aoi.js/typings/type.js';
import type AoiClient from './AoiClient';
import { type ICommandOptions } from '@aoi.js/typings/interface.js';
import { type Snowflake } from 'discord.js';

export default class Command {
	[key: string]: unknown;
	name!: string;
	type!: CommandTypes;
	code!: string | (() => Promise<void>);
	aliases?: string[];
	channel?: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	__path__!: string;
	reverseRead?: boolean;
	executeAt?: 'guild' | 'dm' | 'both';
	// eslint-disable-next-line @typescript-eslint/naming-convention
	__compiled__!: AsyncFunction;

	constructor(data: ICommandOptions, client: AoiClient) {
		this.name = data.name;
		this.type = data.type;
		this.code = data.code;
		this.aliases = data.aliases;
		this.__path__ = data.__path__;
		this.executeAt = data.executeAt ?? 'both';
		this.reverseRead = data.reverseRead ?? false;

		const transpiler = client.transpiler;

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
			let channelId: Snowflake | undefined | AsyncFunction;
			if (this.channel) {
				if (
					typeof this.channel === 'string' &&
					this.channel.startsWith('$')
				) {
					channelId = transpiler.transpile(this.channel, {
						sendMessage: false,
						scopeData: {
							name: 'GLOBAL_CHANNEL',
						},
					}).func;
				} else channelId = this.channel;
			}

			const func = transpiler.transpile(this.code, {
				sendMessage: true,
				reverse: this.reverseRead,
				scopeData: {
					functions:
						typeof channelId === 'function'
							? [channelId.toString()]
							: undefined,
					useChannel:
						typeof channelId === 'function' ? `${channelId.name}()` : channelId,
				},
			});
			this.__compiled__ = func.func;
		}
	}
}
