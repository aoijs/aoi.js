import { BundlerCustoms, ErrorCode } from '@aoi.js/typings/enum.js';
import AoiError from './Error.js';
import { type ICommandOptions } from '@aoi.js/typings/interface.js';
import { type Optional } from '@aoi.js/typings/type.js';
import type AoiClient from '@aoi.js/classes/AoiClient.js';
import Command from '@aoi.js/classes/Command.js';

export default class AoiReader {
	_parseEmbeddedJS(code: string) {
		let cntr = 0,
			isPotentialStart = false,
			tmp = '';
		const embeds = [];

		for (const char of code) {
			if (char === '$') {
				if (cntr) {
					tmp += char;
				}

				if (!isPotentialStart) {
					isPotentialStart = true;
				}
			} else if (char === '{') {
				if (isPotentialStart && !cntr) {
					cntr++;
				} else if (cntr) {
					tmp += char;
					cntr++;
				}
			} else if (char === '}') {
				if (cntr) {
					cntr--;

					if (!cntr) {
						embeds.push(tmp);
						tmp = '';
						isPotentialStart = false;
					} else {
						tmp += char;
					}
				} else if (isPotentialStart) {
					isPotentialStart = false;
				}
			} else {
				if (cntr) {
					tmp += char;
				}
			}
		}

		if (cntr) {
			throw AoiError.ReaderError(
				ErrorCode.EmbedBracketsMismatch,
				'Invalid embedded JS',
				code,
			);
		}

		return embeds;
	}

	_updateEmbedJs(compiled: string, embeds: string[]) {
		while (embeds.length) {
			const embed = embeds.pop()!;
			compiled = this._replaceLast(compiled, BundlerCustoms.EJS, embed);
		}

		return compiled;
	}

	_replaceLast(str: string, find: string, replace: string) {
		const index = str.lastIndexOf(find);
		if (index === -1) {
			return str;
		}

		return str.slice(0, index) + replace + str.slice(index + find.length);
	}

	_parseMetadata(metadataLines: string[]) {
		const metadata: Record<string, unknown> = {};
		let currentKey: string | undefined = undefined;
		let currentValue: unknown = undefined;
		let isObjectBlock = false;

		metadataLines.forEach((line) => {
			line = line.trim();

			if (line.includes('|')) {
				const [key, value] = line.split(':').map((s) => s.trim());
				metadata[key] = value.split('|').map((item) => item.trim());
			} else if (line.endsWith('>') && isObjectBlock) {
				isObjectBlock = false;
				metadata[currentKey!] = currentValue;
				currentKey = undefined;
			} else if (isObjectBlock) {
				const [key, value] = line.split(':').map((s) => s.trim());
				(currentValue as Record<string, unknown>)[key] = value;
			} else {
				const [key, value] = line.split(':').map((s) => s.trim());
				if (value.startsWith('<')) {
					currentKey = key;
					currentValue = {};
					isObjectBlock = true;
				} else {
					metadata[key] = value;
				}
			}
		});

		return metadata;
	}

	_parseCmd(cmdString: string) {
		const sections = cmdString.split('---');

		if (sections.length < 3) {
			throw new SyntaxError(
				'Invalid command format provided:\n\n' + cmdString,
			);
		}

		let result: Optional<ICommandOptions, '__path__'>;

		const metadataLines = sections[1].trim().split('\n');
		result = this._parseMetadata(metadataLines) as Optional<
		ICommandOptions,
		'__path__'
		>;

		result.code = sections.slice(2).join('---').trim();
		return result;
	}

	parse(code: string, client: AoiClient) {
		const embeddedJS = this._parseEmbeddedJS(code);

		for (const ejs of embeddedJS) {
			code = code.replace(`\${${ejs}}`, BundlerCustoms.EJS);
		}

		const cmd = new Command(
			{ ...this._parseCmd(code), __path__: 'root' },
			client,
		);
		cmd.code = client.transpiler.transpile(cmd.code as string, {
			scopeData: {
				embeddedJS: embeddedJS,
			},
			sendMessage: true,
			reverse: cmd.reverseRead ?? false,
			command: cmd,
		}).func!;

		return cmd;
	}
}

/*
```aoi
---
name: ping
type: basic
alias: ms | latency | pong
info: < 
	usage: !ping
	description: returns ping
	>
---

Pong! current ping is $pingms!
```
*/
