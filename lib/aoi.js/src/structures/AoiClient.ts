/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	Client,
	type CreateApplicationCommandPayload,
	type Snowflake,
	createCacheManager,
} from 'zeneth';
import {
	type AoiClientType,
	type AoiClientOptions,
	type CommandOptions,
} from '../typings/interfaces.js';
import { CommandManager } from '../manager/Command.js';
import { onMessage } from '../events/messageCreate.js';
import { Util } from './Util.js';
import { FunctionManager } from '../manager/Function.js';
import { type CommandMethods, type CommandTypes } from '../typings/types.js';
import { type AoiClientEvents } from '../typings/enums.js';
import { onInteraction } from '../events/interactionCreate.js';
import { onReady } from '../events/ready.js';
import { readFileSync } from 'fs';

// @ts-ignore
class AoiClient implements AoiClientType {
	static create() {
		const file = './config.aoi';
		const config = JSON.parse(
			readFileSync(file, 'utf-8'),
		) as AoiClientOptions;
		return new AoiClient(config);
	}

	client: Client;
	managers: { commands: CommandManager; functions: FunctionManager };
	options: AoiClientOptions;
	cache: any;
	util: Util;
	__on__: Partial<Record<AoiClientEvents, Array<(...args: unknown[]) => void>>> =
		{};

	constructor(options: AoiClientOptions) {
		this.client = new Client(options);
		this.managers = {
			commands: new CommandManager(this),
			functions: new FunctionManager(this),
		};
		this.options = options;
		if (options.caches)
			this.cache = createCacheManager(options.caches, this.client);

		this.#bindEvents();
		this.#bindCommands();
		this.util = new Util(this);
		this.__on__ = {};
	}

	emit(event: AoiClientEvents, ...args: unknown[]) {
		if (this.__on__[event]) {
			for (const func of this.__on__[event] ?? []) {
				func(...args);
			}
		}
	}

	on(event: AoiClientEvents, func: (...args: unknown[]) => void) {
		if (!this.__on__[event]) this.__on__[event] = [];
		this.__on__[event]?.push(func);
	}

	async createApplicationCommand(
		globalOrGuldId: 'global' | Snowflake,
		data: CreateApplicationCommandPayload,
	) {
		if (globalOrGuldId === 'global') {
			return this.client.createGlobalApplicationCommand(data);
		}

		return this.client.createGuildApplicationCommand(globalOrGuldId, data);
	}

	returnComponent(name: string, dataString: string) {
		const component = this.managers.commands.component.get(name);
		if (!component) throw new Error(`Component ${name} not found`);
		const func = component.__compiled__.toString();
		return `
${dataString};
${func}
`;
	}

	#bindEvents() {
		for (const event of this.options.events)
			switch (event) {
				case 'MessageCreate':
					onMessage(this);
					break;
				case 'InteractionCreate':
					onInteraction(this);
					break;
				case 'Ready':
					onReady(this);
					break;
				default:
					break;
			}
	}

	#bindCommands() {
		const cmdTypes = this.managers.commands.types as CommandTypes[];
		for (const type of cmdTypes) {
			const cmdType = `${type}Command` as const;
			const parsedType =
				cmdType === 'basicCommand'
					? 'command'
					: (cmdType as CommandMethods);
			// @ts-ignore
			this[parsedType] = function (
				...cmd: Array<Omit<CommandOptions, 'type'>>
			) {
				const cmds = cmd.map((c) => {
					return {
						...c,
						type,
					};
				}) as CommandOptions[];
				this.managers.commands.addMany(cmds);
			};
		}

		// @ts-ignore
		this.componentCommand = function (
			...cmd: Array<Omit<CommandOptions, 'type'>>
		) {
			const cmds = cmd.map((c) => {
				return {
					...c,
					type: 'component',
				};
			}) as CommandOptions[];
			this.managers.commands.addMany(cmds);
		};
	}
}

export { AoiClient };
