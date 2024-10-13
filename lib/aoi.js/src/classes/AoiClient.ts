import Transpiler from '@aoi.js/core/Transpiler.js';
import { CommandManager } from '@aoi.js/managers/Command.js';
import FunctionManager from '@aoi.js/managers/Function.js';
import { type IAoiClientOptions } from '@aoi.js/typings/interface.js';
import { type AoiClientProps } from '@aoi.js/typings/type.js';
import { Client, DefaultWebSocketManagerOptions, Partials, type ClientOptions } from 'discord.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface AoiClient extends AoiClientProps {
	client: Client;
}


// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class AoiClient {
	client!: Client;
	
	transpiler: Transpiler;
	database = null;
	managers!: {
		commands: CommandManager;
		functions: FunctionManager;
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
		};

		if (options.testMode) return;

		const djsOptions: ClientOptions = options.djsClientOptions ?? { intents: 0 };
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
	}

	async start() {
		await this.client.login(this.#options.token);
	}

	#validateOptions(options: IAoiClientOptions) {
		if (options.intents === undefined) {
			throw new SyntaxError('Intents not provided, "Guilds" intent is required');
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

	get prefix() {
		return this.#options.prefix;
	}

	get options() {
		return this.#options;
	}
}

export default AoiClient;