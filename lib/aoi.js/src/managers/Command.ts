import Command from '../classes/Command.js';
import { Group } from '@aoijs/structures';
import {
	type ICommandOptions,
	type ITranspilerData,
} from '../typings/interface.js';
import { type CommandTypes, type Optional } from '../typings/type.js';
import fs, { readFile } from 'fs/promises';
import type AoiClient from '@aoi.js/classes/AoiClient.js';
import Path from 'path';
import AoiReader from '@aoi.js/core/AoiReader.js';
<<<<<<< HEAD
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode } from '@aoi.js/typings/enum.js';
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb

export class CommandManager {
	static cmdTypes() {
		return ['basic', 'interaction', 'ready', 'debug', 'component'];
	}

	basic: Group<number, Command> = new Group<number, Command>(Infinity);
	interaction: Group<number, Command> = new Group<number, Command>(Infinity);
	ready: Group<number, Command> = new Group<number, Command>(Infinity);
	debug: Group<number, Command> = new Group<number, Command>(Infinity);
<<<<<<< HEAD
=======
	component: Group<string, Command> = new Group<string, Command>(Infinity);
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb

	readonly #client: AoiClient;
	readonly #reader: AoiReader;
	constructor(client: AoiClient) {
		this.#client = client;
		this.#reader = new AoiReader();
	}

	isValidType(type: string) {
		return ['basic', 'interaction', 'ready', 'debug'].includes(type);
	}

	get types() {
		return ['basic', 'interaction', 'ready', 'debug'];
	}

	add(command: Optional<ICommandOptions, '__path__'>) {
		if (!command.name) throw new Error('Command name is required');
		if (!command.type) throw new Error('Command type is required');
		if (!command.__path__) command.__path__ = 'root';
		const cmd = new Command(command as ICommandOptions, this.#client);
<<<<<<< HEAD
		if (this.isValidType(command.type)) {
			this[command.type].set(this[command.type].size, cmd);
		} else {
			throw AoijsErrorHandler.CommandError(
				ErrorCode.InvalidCommandType,
				'Invalid command type provided',
				cmd,
			);
=======
		if (this.isValidType(command.type) && command.type !== 'component') {
			 
			this[command.type].set(this[command.type].size, cmd);
		} else {
			if (command.type === 'component')
				 
				this.component.set(command.name, cmd);
			else {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-expect-error
				throw new Error('Invalid command type provided', {
					...command,
				});
			}
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
		}
	}

	addMany(commands: Array<Optional<ICommandOptions, '__path__'>>) {
		for (const command of commands) this.add(command);
	}

	async load({
		path,
		usingAoi = false,
	}: {
		path: string;
		usingAoi?: boolean;
	}) {
		const chalk = (await import('chalk')).default;
		const boxen = (await import('boxen')).default;
		const stats = await fs.stat(path);
		const commands: Array<{
			path: string;
			loaded: boolean;
			reason?: string;
		}> = [];
		if (!usingAoi) {
			if (stats.isDirectory()) {
				const files = await fs.readdir(path);
				for (const file of files) {
					const filePath = path + '/' + file;
					const stats = await fs.stat(filePath);
					if (stats.isDirectory())
						await this.load({ path: filePath, usingAoi });
					else if (
						stats.isFile() &&
						file.endsWith('.js') &&
						!file.endsWith('.template.js')
					) {
						// importing on windows
						let command;
						try {
							command = await this.loadFile(filePath);
							if (Array.isArray(command.default)) {
								this.addMany(command.default);
							} else this.add(command.default);

							commands.push({
								path: filePath.split('/').pop()!,
								loaded: true,
							});
						} catch (e) {
							/* empty */
							commands.push({
								path: filePath.split('/').pop()!,
								loaded: false,
								reason: e as string,
							});
						}
					}
				}
			}
		} else {
			if (stats.isDirectory()) {
				const files = await fs.readdir(path);
				for (const file of files) {
					const filePath = path + '/' + file;
					const stats = await fs.stat(filePath);
					if (stats.isDirectory())
						await this.load({ path: filePath, usingAoi });
					else if (
						stats.isFile() &&
						file.endsWith('.aoi') &&
						!file.endsWith('.template.aoi')
					) {
						const command = await readFile(filePath, 'utf-8');
						try {
<<<<<<< HEAD
							const cmd = this.#reader.parse(
								command,
								this.#client,
							);
=======
							const cmd = this.#reader.parse(command, this.#client);
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
							cmd.__path__ = filePath;
							this.add(cmd as ICommandOptions);
							commands.push({
								path: filePath.split('/').pop()!,
								loaded: true,
							});
						} catch (e) {
							commands.push({
								path: filePath.split('/').pop()!,
								loaded: false,
								reason: e as string,
							});
						}
					}
					// else if(stats.isFile() && file.endsWith(".aoi") && !file.endsWith(".template.aoi")) {
					//     const command = await import(filePath);
					//     this.add(command.default);
					// }
				}
			}
		}

		const box = boxen(
<<<<<<< HEAD
			`${commands
				.map((cmd) => {
					return `∷ ${chalk.cyanBright(
						cmd.loaded ? 'Loaded' : 'Failed',
					)} ${chalk.greenBright(cmd.path)} ${chalk.redBright(
						cmd.loaded ? '' : cmd.reason,
					)}`;
				})
				.join('\n')}
=======
			`${commands.map((cmd) => {
				return `∷ ${chalk.cyanBright(
					cmd.loaded ? 'Loaded' : 'Failed',
				)} ${chalk.greenBright(cmd.path)} ${chalk.redBright(
					cmd.loaded ? '' : cmd.reason,
				)}`;
			}).join('\n')}
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
        `,
			{
				title: `∴ Loading ${chalk.blueBright(
					path,
				)} ( ${chalk.yellowBright(commands.length)} )`,
				borderStyle: 'round',
				borderColor: 'cyan',
				textAlignment: 'left',
				backgroundColor: 'black',
				width: 100,
				padding: 1,
				dimBorder: true,
				float: 'center',
			},
		);

		console.log(box);
	}

	async exec({
		type,
		data,
		filter,
	}: {
		type: CommandTypes;
		data: Optional<ITranspilerData, 'command'>;
		filter: (cmd: Command) => boolean;
	}) {
		 
		const cmd = this[type].filter((cmd) => filter(cmd));
		if (cmd.size) {
			 
			for (const command of cmd.values()) {
				 
				await command.__compiled__({ ...data, command });
			}
		}
	}

	async loadFile(filePath: string) {
<<<<<<< HEAD
		let command: {
			default:
			| Optional<ICommandOptions, '__path__'>
			| Array<Optional<ICommandOptions, '__path__'>>;
		};
=======
		let command: { default: Optional<ICommandOptions, '__path__'> | Array<Optional<ICommandOptions, '__path__'>> };
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
			command = require(filePath);
		} catch {
			if (process.platform === 'win32') {
				const fp = Path.join('file:///', process.cwd(), filePath);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				command = await import(fp);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				command = await import(Path.join(process.cwd(), filePath));
			}
		}
		
		return command;
	}
}
