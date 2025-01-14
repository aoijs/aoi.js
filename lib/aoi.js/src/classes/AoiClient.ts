import Transpiler from '@aoi.js/core/Transpiler.js';
import { CommandManager } from '@aoi.js/managers/Command.js';
import FunctionManager from '@aoi.js/managers/Function.js';
import {
	type ICommandOptions,
	type IAoiClientOptions,
} from '@aoi.js/typings/interface.js';
import { type Optional, type CommandTypes, type AsyncFunction } from '@aoi.js/typings/type.js';
import { Client, Partials, type ClientOptions } from 'discord.js';
import * as Events from '@aoi.js/events/index.js';
import { MacrosManager } from '@aoi.js/managers/Macro.js';

class AoiClient {
	client!: Client;

	transpiler: Transpiler;
	database = null;
	managers!: {
		commands: CommandManager;
		functions: FunctionManager;
		macros: MacrosManager;
	};

	readonly #options: IAoiClientOptions;

	constructor(options: IAoiClientOptions) {
		this.#validateOptions(options);
		this.#options = options;

		const transpilerOptions = {
			minify: options.transpilerOptions?.minify ?? true,
			customFunctions: {},
		};

		this.transpiler = new Transpiler(transpilerOptions, this);
		this.managers = {
			commands: new CommandManager(this),
			functions: new FunctionManager(this),
			macros: new MacrosManager(this),
		};
		if (options.testMode) return;

		const djsOptions: ClientOptions = options.djsClientOptions ?? {
			intents: 0,
		};

		djsOptions.partials ||= [
			Partials.GuildMember,
			Partials.Channel,
			Partials.Message,
			Partials.Reaction,
			Partials.User,
			Partials.GuildScheduledEvent,
			Partials.ThreadMember,
		];
		djsOptions.intents = options.intents;

		this.client = new Client(djsOptions);
		this.#bindEvents();
	}

	async start() {
		await this.client.login(this.#options.token);
	}

	command(data: Optional<ICommandOptions, '__path__' | 'type'>) {
		if (!data.type) data.type = 'basic' as CommandTypes;
		data.__path__ = data.__path__ ?? 'root';

		this.managers.commands.add(data as ICommandOptions);
		return this;
	}

	macro(name: string, code: string | AsyncFunction) {
		this.managers.macros.add({ name, code });
		return this;
	}

	// returnComponent(name: string, dataString: string) {
	// 	const func = this.managers.commands.component.get(name);
	// 	if (!func) return '';

	// 	const code = func.__rawFnString__;

	// 	return `
	// 	{
	// 		const ${name}_data = ${dataString};
	// 		${code}
	// 	}
	// 	`;
	// }

	#validateOptions(options: IAoiClientOptions) {
		if (options.intents === undefined) {
			throw new SyntaxError(
				'Intents not provided, "Guilds" intent is required',
			);
		}

		if (isNaN(options.intents)) {
			throw new TypeError('Provided intents are not of type "number"');
		}

		if (!options.token) {
			throw new SyntaxError('Token not provided');
		}

		if (!options.prefix?.length) {
			throw new SyntaxError('Prefix not provided');
		}
	}

	#bindEvents() {
		this.#options.events.forEach((event) => {
			Events[event]?.(this);
		});
	}

	get prefix() {
		return this.#options.prefix;
	}

	get options() {
		return this.#options;
	}
}

export default AoiClient;
