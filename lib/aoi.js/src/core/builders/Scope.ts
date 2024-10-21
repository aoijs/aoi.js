import type AoiClient from '@aoi.js/classes/AoiClient.js';
import {
	BundlerCustoms,
	FunctionType,
	TranspilerCustoms,
} from '@aoi.js/typings/enum.js';
import { type ICodeFunctionData } from '@aoi.js/typings/interface.js';
import {
	escapeResult,
	escapeVars,
	parseResult,
} from '@aoi.js/utils/Helpers/core.js';
import { fixMath } from '@aoi.js/core/parsers/math.js';
import { parseString } from '@aoi.js/core/parsers/string.js';
import type StringObject from './StringObject.js';

export default class Scope {
	name: string;
	parent: string | undefined;
	children: Scope[] = [];
	content: string;
	embeds: unknown[] = [];
	components: unknown[] = [];
	files: unknown[] = [];
	stickers: unknown[] = [];
	env: string[];
	ephemeral = false;
	variables: string[];
	setters: string;
	objects: Record<string, StringObject>;
	hasSendData: boolean;
	sendFunction: string;
	functions: string;
	_funcList: string[] = [];
	_contentParts: string[] = [];
	_packages: string[] = [];
	addReturn: boolean;
	useChannel?: bigint | string;
	embeddedJS: string[] = [];
	packages = '';
	client: AoiClient;
	constructor(
		name: string,
		client: AoiClient,
		parent?: string,
		ast?: ICodeFunctionData,
		addReturn?: boolean,
	) {
		this.name = name;
		this.sendFunction = 'await __$DISCORD_DATA$__.channel.send';
		this.parent = parent;
		this.hasSendData = false;
		this.content = ast ? this.getContent(ast) : ' ';
		this.variables = [];
		this.objects = {};
		this.env = [];
		this.setters = '';
		this.functions = '';
		this.addReturn = addReturn ?? false;
		this.client = client;
	}

	getContent(ast: ICodeFunctionData): string {
		// remove all non returning functionType
		const parts = [ast.executed];
		if (ast.funcs.length) {
			let idx = 0;
			for (const func of ast.funcs) {
				if (
					[
						FunctionType.Function,
						FunctionType.Scope,
						FunctionType.Setter,
					].includes(func.type)
				) {
					const lastPart = parts.at(-1)!;
					const splits = lastPart.split(`#FUNCTION_${idx}#`);
					parts.pop();
					parts.push(...splits);
				}

				idx++;
			}
		}

		this._contentParts = parts;
		return parts.join('');
	}

	updateContentParts(part: string, replacedTo: string) {
		this._contentParts = this._contentParts.map((p) =>
			p.replace(part, replacedTo),
		);
	}

	addVariables(...scopeVars: string[]) {
		this.variables.push(...scopeVars);
	}

	hasVariable(name: string) {
		return this.variables.includes(name);
	}

	addEmbeds(embeds: unknown[]) {
		this.embeds.push(...embeds);
	}

	addFunction(func: string) {
		this.functions += func + ' \n';
		this._funcList.push(func.split(' ')[1].trim());
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

	addPkg(pkgName: string, code: string) {
		this.packages += code + '\n';
		this._packages.push(pkgName);
	}

	hasPkg(pkgName: string) {
		return this._packages.includes(pkgName);
	}

	getFunction(code: string, sendMessage = true, execute = false) {
		const name = this.name === 'global' ? 'main' : this.name;
		return (
			`async function ${name}(__$DISCORD_DATA$__) {\n${this.generate(
				code,
				sendMessage,
			)}\n}` +
			(execute
				? `\n${
					this.addReturn ? 'return ' : ''
				}${name}(__$DISCORD_DATA$__);`
				: '')
		).replaceAll(TranspilerCustoms.SL, '`');
	}

	clone(name: string) {
		const scope = new Scope(name, this.client, this.parent);
		scope.embeds = this.embeds;
		scope.components = this.components;
		scope.files = this.files;
		scope.stickers = this.stickers;
		scope.env = this.env;
		scope.variables = this.variables;
		scope.setters = this.setters;
		scope.objects = this.objects;
		scope.hasSendData = this.hasSendData;
		scope.sendFunction = this.sendFunction;
		scope.functions = this.functions;
		scope._funcList = this._funcList;
		scope.addReturn = this.addReturn;
		scope.useChannel = this.useChannel;
		scope.embeddedJS = this.embeddedJS;
		scope.packages = this.packages;
		return scope;
	}

	merge(scope: Scope) {
		this.embeds.push(...scope.embeds);
		this.components.push(...scope.components);
		this.files.push(...scope.files);
		this.stickers.push(...scope.stickers);
		this.env.push(...scope.env);
		this.variables.push(...scope.variables);
		this.setters += scope.setters;
		this.objects = { ...this.objects, ...scope.objects };
		this.hasSendData = this.hasSendData || scope.hasSendData;
		this.functions += scope.functions;
		this._funcList.push(...scope._funcList);
		this.addReturn = this.addReturn || scope.addReturn;
		this.useChannel = scope.useChannel ?? this.useChannel;
		this.embeddedJS.push(...scope.embeddedJS);
		this.packages += scope.packages;
	}

	generate(code: string, sendMessage = true, asFunction = true) {
		if (sendMessage)
			for (const part of this._contentParts) {
				code = code.replace(part, '');
			}

		const sendData = {
			content: this.content
				.replaceAll('\n', TranspilerCustoms.NL)
				.replaceAll(BundlerCustoms.EJS, ''),
			embeds: escapeResult(escapeVars(`${this.name}_embeds`)),
			components: escapeResult(escapeVars(`${this.name}_components`)),
			files: escapeResult(escapeVars(`${this.name}_files`)),
			stickers: escapeResult(escapeVars(`${this.name}_stickers`)),
		};

		if (
			sendData.content.replaceAll(TranspilerCustoms.NL, '').trim() !==
				'' ||
			this.embeds.length ||
			this.files.length ||
			this.stickers.length
		)
			this.hasSendData = true;
		else this.hasSendData = false;

		sendData.content = parseString(
			sendData.content.replaceAll(TranspilerCustoms.NL, '\n').trim(),
		)
			.replaceAll(TranspilerCustoms.SL, '\\`')
			.trim();

		if (sendData.content.trim() === '') {
			sendData.content = ' ';
		}

		sendData.content = fixMath(
			sendData.content === '``' ? '` `' : sendData.content,
		);

		const payload = `{
		  content: ${sendData.content},
		  embeds: ${sendData.embeds},
		  components: ${sendData.components},
		  files: ${sendData.files},
		  stickers: ${sendData.stickers},
		  flags: ${this.ephemeral ? 64 : 0},
		}`.replaceAll(TranspilerCustoms.NL, '\\\\n');

		const channelSendFunction = this.useChannel
			? `__$DISCORD_DATA$__.client.channels.cache.get(${parseString(
				typeof this.useChannel === 'bigint'
					? this.useChannel.toString() + 'n'
					: this.useChannel.toString(),
			)}).send`
			: this.sendFunction;

		const sent =
			this.hasSendData && sendMessage
				? `
		${this.addReturn ? 'return ' : ''} await ${channelSendFunction}( ${payload} );`
				: '';

		const initialVars = sendMessage
			? `	  
			const ${escapeVars(`${this.name}_embeds`)} = [];
			const ${escapeVars(`${this.name}_components`)} = [];
			const ${escapeVars(`${this.name}_files`)} = [];
			const ${escapeVars(`${this.name}_stickers`)} = [];
		`
			: '';

		return parseResult(
			asFunction
				? `
	  async function ${this.name === 'global' ? 'main' : this.name}(__$DISCORD_DATA$__) {
			${initialVars}
			${this.packages}
			${this.functions}
			${code}
			${sent}
	}
		`.replaceAll(TranspilerCustoms.SL, '\\`')
				: `
			${initialVars}
			${this.packages}
			${this.functions}
			${code}
			${sent}
		`.replaceAll(TranspilerCustoms.SL, '\\`'),
		).trim();
	}
}
