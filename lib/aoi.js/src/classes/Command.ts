import { type AsyncFunction, type CommandTypes } from '@aoi.js/typings/type.js';
import type AoiClient from './AoiClient.js';
import { type ICommandOptions } from '@aoi.js/typings/interface.js';
import { type Snowflake } from 'discord.js';
import { escapeResult } from '@aoi.js/utils/Helpers/core.js';

export default class Command {
	[key: string]: unknown;
	name!: string;
	type!: CommandTypes;
	code!: string | AsyncFunction;
	aliases?: string[];
	channel?: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	__path__!: string;
	reverseRead?: boolean;
	executeAt?: 'guild' | 'dm' | 'both';
	// eslint-disable-next-line @typescript-eslint/naming-convention
	__compiled__!: AsyncFunction;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	__rawFnString__!: string;

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

		if (this.code instanceof Function) {
			this.__compiled__ = this.code;
			// get string representation of the function with the function name
			this.__rawFnString__ = `const ${this.name}_func = ${this.code.toString()}
			${this.name}_func(__$DISCORD_DATA$__);
			`;
		} else {
			let channelId: Snowflake | undefined;
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
						asFunction: false,
						command: this,
					}).result;
				} else channelId = this.channel;
			}



			const func = transpiler.transpile(this.code, {
				sendMessage: true,
				reverse: this.reverseRead,
				scopeData: {
					useChannel: channelId?.includes('__$DISCORD_DATA$__')
						? escapeResult(channelId)
						: channelId,
				},
				command: this,
			});

			

			this.__compiled__ = func.func!;
			this.__rawFnString__ = func.result;
		}
	}
}
