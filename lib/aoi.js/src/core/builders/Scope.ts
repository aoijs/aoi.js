import type AoiClient from '@aoi.js/classes/AoiClient';
import { BundlerCustoms, FunctionType, TranspilerCustoms } from '@aoi.js/typings/enum.js';
import { type ICodeFunctionData } from '@aoi.js/typings/interface.js';
import {
	escapeResult,
	escapeVars,
	parseResult,
	removeMultiLineComments,
	removeSetFunc,
} from '@aoi.js/utils/helpers.js';
import { fixMath } from '@aoi.js/core/parsers/math.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import type StringObject from './StringObject.js';

export default class Scope {
	name: string;
	parent: string | undefined;
	children: Scope[] = [];
	sendData: {
		content: string;
	};

	embeds: unknown[] = [];
	components: unknown[] = [];
	files: unknown[] = [];
	stickers: unknown[] = [];
	env: string[];
	ephemeral = false;
	variables: string[];
	setters: string;
	objects: Record<string, StringObject>;
	rest: string;
	hasSendData: boolean;
	sendFunction: string;
	functions: string;
	_funcList: string[] = [];
	addReturn: boolean;
	useChannel?: bigint | string;
	embeddedJS: string[] = [];
	packages = '';
	client: AoiClient;
	constructor(
		name: string,
		client: AoiClient,
		parent?: string,
		code?: string,
		addReturn?: boolean,
	) {
		this.name = name;
		this.sendFunction = 'await __$DISCORD_DATA$__.client.createMessage';
		this.parent = parent;
		this.hasSendData = false;
		this.sendData = {
			content: code?.replaceAll('`', TranspilerCustoms.SL) ?? ' ',
		};
		this.variables = [];
		this.objects = {};
		this.env = [];
		this.setters = '';
		this.functions = '';
		this.rest = code?.replaceAll('`', TranspilerCustoms.SL) ?? '';
		this.addReturn = addReturn ?? false;
		this.client = client;
	}

	addVariables(scopeVars: string[]) {
		this.variables.push(...scopeVars);
	}

	addEmbeds(embeds: unknown[]) {
		this.embeds.push(...embeds);
	}

	addFunction(func: string) {
		this.functions += func + ' \n';
	}

	replaceLast(str: string, replacer: string, replacedTo: string) {
		const index = str.lastIndexOf(replacer);
		if (index === -1) return str;
		return (
			str.substring(0, index) +
            replacedTo +
            str.substring(index + replacer.length)
		);
	}

	replace(str: string, replacer: string, replacedTo: string) {
		const index = str.indexOf(replacer);
		if (index === -1) return str;
		return (
			str.substring(0, index) +
            replacedTo +
            str.substring(index + replacer.length)
		);
	}

	addChild(child: string) {
		this.children.push(new Scope(child, this.client, this.name));
	}

	getChild(name: string) {
		return this.children.find((child) => child.name === name);
	}

	removeChild(name: string) {
		this.children = this.children.filter((child) => child.name !== name);
	}

	updateEmbedJs() {
		const embeds = [...this.embeddedJS.reverse()];
		for (const embed of embeds) {
			const old = this.rest;
			this.rest = this.replaceLast(this.rest, BundlerCustoms.EJS, embed);
			if (this.rest === old) {
				this.packages = this.embeddedJS.shift() + '\n' + this.packages;
			} else {
				this.embeddedJS.shift();
			}
		}
	}

	toString(sendMessage = true) {
		const sendData: Record<string, string> = { ...this.sendData };
		sendData.embeds = escapeResult(escapeVars(`${this.name}_embeds`));
		sendData.components = escapeResult(
			escapeVars(`${this.name}_components`),
		);
		sendData.files = escapeResult(escapeVars(`${this.name}_files`));
		sendData.stickers = escapeResult(escapeVars(`${this.name}_stickers`));
		sendData.content = sendData.content
			.replaceAll('\n', TranspilerCustoms.NL)
			.replaceAll(BundlerCustoms.EJS, '');
		if (
			sendData.content.replaceAll(TranspilerCustoms.NL, '').trim() !==
                '' ||
            this.embeds.length ||
            this.files.length ||
            this.stickers.length
		)
			this.hasSendData = true;
		else this.hasSendData = false;

		let parsedStr = parseString(
			sendData.content.replaceAll(TranspilerCustoms.NL, '\n').trim(),
		);
		parsedStr =
            parsedStr.trim().replaceAll(TranspilerCustoms.SL, '\\`') === ''
            	? ' '
            	: parsedStr.trim().replaceAll(TranspilerCustoms.SL, '\\`');

		if (sendData.content.trim() !== '') {
			this.rest = this.replaceLast(
				parseResult(removeMultiLineComments(this.rest.trim())),
				sendData.content.replaceAll(TranspilerCustoms.NL, '\n').trim(),
				'',
			);
		}

		parsedStr = parsedStr.replaceAll('\\n', TranspilerCustoms.NL);

		const sent = `{
  content: ${fixMath(parsedStr.trim() === '``' ? '` `' : parsedStr)},
  embeds: ${escapeVars(`${this.name}_embeds`)},
  components: ${escapeVars(`${this.name}_components`)},
  files: ${escapeVars(`${this.name}_files`)},
  stickers: ${escapeVars(`${this.name}_stickers`)},
  flags: ${this.ephemeral ? 64 : 0},
    }`.replaceAll(TranspilerCustoms.NL, '\\\\n');

		return parseResult(
			`const ${escapeVars(`${this.name}_embeds`)} = [];\n` +
                `const ${escapeVars(`${this.name}_components`)} = [];\n` +
                `const ${escapeVars(`${this.name}_files`)} = [];\n` +
                `const ${escapeVars(`${this.name}_stickers`)} = [];\n` +
                `${this.packages}` +
                `${this.setters}\n\n${
                	this.functions
                }\n\n${this.rest.trim()}\n\n`.trim() +
                `\n${(() => {
                	if (this.hasSendData && sendMessage) {
                		return `${this.addReturn ? 'return ' : ''} await ${
                			this.useChannel
                				? this.sendFunction +
                                  `(${parseString(
                                  	typeof this.useChannel === 'bigint'
                                  		? this.useChannel.toString() + 'n'
                                  		: this.useChannel.toString(),
                                  )},${sent});`
                				: this.sendFunction +
                                  `(__$DISCORD_DATA$__.message.channelId,${sent});`
                		}`;
                	} else {
                		return '';
                	}
                })()}`,
		).replaceAll(TranspilerCustoms.SL, '\\`');
	}

	getFunction(sendMessage = true, execute = false) {
		const name = this.name === 'global' ? 'main' : this.name;
		return (
			`async function ${name}(__$DISCORD_DATA$__) {\n${this.toString(
				sendMessage,
			)}\n}` +
            (execute
            	? `\n${
            		this.addReturn ? 'return ' : ''
            	}${name}(__$DISCORD_DATA$__);`
            	: '')
		).replaceAll(TranspilerCustoms.SL, '`');
	}

	editMessage(channel: string, message: string) {
		const sendData: Record<string, string> = { ...this.sendData };
		sendData.embeds = escapeResult(escapeVars(`${this.name}_embeds`));
		sendData.components = escapeResult(
			escapeVars(`${this.name}_components`),
		);
		sendData.files = escapeResult(escapeVars(`${this.name}_files`));
		sendData.content = sendData.content.replaceAll(
			'\n',
			TranspilerCustoms.NL,
		);
		if (
			sendData.content.replaceAll(TranspilerCustoms.NL, '').trim() !==
                '' ||
            this.embeds.length ||
            this.files.length ||
            this.stickers.length
		)
			this.hasSendData = true;
		else this.hasSendData = false;

		let parsedStr = parseString(
			sendData.content.replaceAll(TranspilerCustoms.NL, '\n').trim(),
		);
		parsedStr = parsedStr.trim() === '' ? ' ' : parsedStr.trim();

		this.rest = this.replaceLast(
			this.rest.trim(),
			this.sendData.content.trim(),
			'',
		);

		const sent = `{
  content: ${parsedStr.replaceAll('\\n', TranspilerCustoms.NL)},
  embeds: ${escapeVars(`${this.name}_embeds`)},
  components: ${escapeVars(`${this.name}_components`)},
  files: ${escapeVars(`${this.name}_files`)},
  stickers: ${escapeVars(`${this.name}_stickers`)},
    }`.replaceAll(TranspilerCustoms.NL, '\\\\n');

		return parseResult(
			`async function ${
				this.name === 'global' ? 'main' : this.name
			}(__$DISCORD_DATA$__) {\n` +
                `const ${escapeVars(`${this.name}_embeds`)} = [];\n` +
                `const ${escapeVars(`${this.name}_components`)} = [];\n` +
                `const ${escapeVars(`${this.name}_files`)} = [];\n` +
                `const ${escapeVars(`${this.name}_stickers`)} = [];\n` +
                `${this.packages}` +
                `${this.setters}\n\n${
                	this.functions
                }\n\n${this.rest.trim()}\n\n`.trim() +
                `\n${(() => {
                	if (this.hasSendData) {
                		return `${
                			this.addReturn ? 'return ' : ''
                		} await ${`__$DISCORD_DATA$__.client.editMessage(${parseString(
                			channel,
                		)},${parseString(message)},${sent}).catch(e => {
              throw e;
            });`}`;
                	} else {
                		return '';
                	}
                })()}` +
                '\n}',
		).replaceAll(TranspilerCustoms.SL, '\\`');
	}

	update(res: string, data: ICodeFunctionData) {
		if (data.type === FunctionType.Function) {
			this.rest = this.rest.replace(
				data.total.replaceAll(TranspilerCustoms.FSEP, ';'),
				res.replaceAll('$', '$$$$'),
			);
		} else if (data.type === FunctionType.Setter) {
			this.setters += res + '\n';

			this.rest = this.rest.replace(
				removeSetFunc(data.total).replaceAll(
					TranspilerCustoms.FSEP,
					';',
				),
				'',
			);
		} else if (data.type === FunctionType.FunctionGetter) {
			this.rest = this.rest.replace(
				data.total.replaceAll(TranspilerCustoms.FSEP, ';'),
				res.replaceAll('$', '$$$$'),
			);
		} else if (data.type === FunctionType.Getter) {
			this.rest = this.rest.replace(
				data.total.replaceAll(TranspilerCustoms.FSEP, ';'),
				res.replaceAll('$', '$$$$'),
			);
			// this.rest = this.replaceLast(this.rest, data.total.replaceAll(TranspilerCustoms.FSEP, ";"),res.replaceAll("$", "$$$$"));
		} else if (data.type === FunctionType.Scope || data.type === FunctionType.ScopeGetter) {
			this.rest = this.rest.replace(
				data.total.replaceAll(TranspilerCustoms.FSEP, ';'),
				res.replaceAll('$', '$$$$'),
			);
			data.funcs = [];
		}
	}

	rawString() {
		const sendData: Record<string, string> = { ...this.sendData };
		sendData.embeds = escapeResult(escapeVars(`${this.name}_embeds`));
		sendData.components = escapeResult(
			escapeVars(`${this.name}_components`),
		);
		sendData.files = escapeResult(escapeVars(`${this.name}_files`));
		sendData.stickers = escapeResult(escapeVars(`${this.name}_stickers`));
		sendData.content = sendData.content.replaceAll(
			'\n',
			TranspilerCustoms.NL,
		);
		if (
			sendData.content.replaceAll(TranspilerCustoms.NL, '').trim() !==
                '' ||
            this.embeds.length ||
            this.files.length ||
            this.stickers.length
		)
			this.hasSendData = true;
		else this.hasSendData = false;

		return parseResult(`\n\n${this.rest.trim()}\n\n`.trim()).replaceAll(
			TranspilerCustoms.SL,
			'\\`',
		);
	}
}
