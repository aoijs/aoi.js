import Transpiler from '@aoi.js/core/Transpiler';
import { type CommandTypes } from '@aoi.js/typings/type.js';
import type AoiClient from './AoiClient';
import { type ICommandOptions } from '@aoi.js/typings/interface.js';

export default class Command {
	[key: string]: unknown;
	name!: string;
	type!: CommandTypes;
	code!: string | (() => Promise<void>);
	aliases?: string[];
	channel?: string | bigint;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	__path__!: string;
	reverseRead?: boolean;
	executeAt?: 'guild' | 'dm' | 'both';
	// eslint-disable-next-line @typescript-eslint/naming-convention
	__compiled__!: () => Promise<void>;

	constructor(data: ICommandOptions, client: AoiClient) {
		// this.name = data.name;
		// this.type = data.type;
		// this.code = data.code;
		// this.aliases = data.aliases;
		// this.__path__ = data.__path__;
		// this.executeAt = data.executeAt ?? 'both';
		// this.reverseRead = data.reverseRead ?? false;
		// for (const key in data) {
		// 	if (
		// 		![
		// 			'name',
		// 			'type',
		// 			'code',
		// 			'aliases',
		// 			'__path__',
		// 			'executeAt',
		// 			'reverseRead',
		// 		].includes(key)
		// 	)
		// 		this[key] = data[key];
		// }
		// if (this.code instanceof Function) this.__compiled__ = this.code;
		// else {
		// 	let chan: Snowflake | undefined | AsyncFunction;
		// 	if (this.channel) {
		// 		if (
		// 			typeof this.channel === 'string' &&
		// 			this.channel.startsWith('$')
		// 		) {
		// 			chan = new Transpiler(this.channel, {
		// 				sendMessage: false,
		// 				minify: true,
		// 				customFunctions: client.managers.functions.functions.toJSON(),
		// 				scopeData: {
		// 					name: 'GLOBAL_CHANNEL',
		// 				},
		// 				client,
		// 			}).func;
		// 		} else if (typeof this.channel === 'string')
		// 			chan = BigInt(this.channel);
		// 		else chan = this.channel;
		// 	}
		// 	const func = new Transpiler(this.code, {
		// 		sendMessage: true,
		// 		minify: true,
		// 		reverse: this.reverseRead,
		// 		customFunctions: client.managers.functions.functions.toJSON(),
		// 		client,
		// 		scopeData: {
		// 			functions:
		// 				typeof chan === 'function'
		// 					? `${chan.toString()}`
		// 					: undefined,
		// 			useChannel:
		// 				typeof chan === 'function' ? `${chan.name}()` : chan,
		// 		},
		// 	});
		// 	this.__compiled__ = func.func;
		this.name = data.name;
	}
}
