import { Group } from '@aoijs/structures';
import {
	type IMacroOptions,
	type ITranspilerData,
} from '../typings/interface.js';
import { type Optional } from '../typings/type.js';
import fs, { readFile } from 'fs/promises';
import type AoiClient from '@aoi.js/classes/AoiClient.js';
import Path from 'path';
import AoiReader from '@aoi.js/core/AoiReader.js';
import AoijsErrorHandler from '@aoi.js/core/Error.js';
import { ErrorCode } from '@aoi.js/typings/enum.js';
import Macro from '@aoi.js/classes/Macro.js';

export class MacrosManager {
	macros: Group<string, Macro> = new Group<string, Macro>(Infinity);

	readonly #client: AoiClient;
	readonly #reader: AoiReader;
	constructor(client: AoiClient) {
		this.#client = client;
		this.#reader = new AoiReader();
	}

	add(macro: IMacroOptions) {
		if (!macro.name)
			throw AoijsErrorHandler.MacroError(
				ErrorCode.MissingMacroName,
				'Macro name is required',
				macro,
			);
		if (!macro.code)
			throw AoijsErrorHandler.MacroError(
				ErrorCode.MissingMacroCode,
				'Macro code is required',
				macro,
			);
		const m = new Macro(macro.name, macro.code);
		this.macros.set(m.name, m);
	}

	addMany(macros: IMacroOptions[]) {
		for (const macro of macros) this.add(macro);
	}

	list() {
		return this.macros.K();
	}

	get(name: string) {
		return this.macros.get(name);
	}

	async load(path: string) {
		const chalk = (await import('chalk')).default;
		const boxen = (await import('boxen')).default;
		const stats = await fs.stat(path);
		const macros: Array<{
			path: string;
			loaded: boolean;
			reason?: string;
		}> = [];
		if (stats.isDirectory()) {
			const files = await fs.readdir(path);
			for (const file of files) {
				const filePath = path + '/' + file;
				const stats = await fs.stat(filePath);
				if (stats.isDirectory()) await this.load(filePath);
				else if (
					stats.isFile() &&
					file.endsWith('.js') &&
					!file.endsWith('.template.js')
				) {
					// importing on windows
					let macro;
					try {
						macro = await this.loadFile(filePath);
						if (Array.isArray(macro.default)) {
							this.addMany(macro.default);
						} else this.add(macro.default);

						macros.push({
							path: filePath.split('/').pop()!,
							loaded: true,
						});
					} catch (e) {
						/* empty */
						macros.push({
							path: filePath.split('/').pop()!,
							loaded: false,
							reason: e as string,
						});
					}
				}
			}
		}

		const box = boxen(
			`${macros
				.map((cmd) => {
					return `∷ ${chalk.cyanBright(
						cmd.loaded ? 'Loaded' : 'Failed',
					)} ${chalk.greenBright(cmd.path)} ${chalk.redBright(
						cmd.loaded ? '' : cmd.reason,
					)}`;
				})
				.join('\n')}
        `,
			{
				title: `∴ Loading ${chalk.blueBright(
					path,
				)} ( ${chalk.yellowBright(macros.length)} )`,
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

	async loadFile(filePath: string) {
		let macro: {
			default: IMacroOptions | IMacroOptions[];
		};
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
			macro = require(filePath);
		} catch {
			if (process.platform === 'win32') {
				const fp = Path.join('file:///', process.cwd(), filePath);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				macro = await import(fp);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				macro = await import(Path.join(process.cwd(), filePath));
			}
		}

		return macro;
	}
}
