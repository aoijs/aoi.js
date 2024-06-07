import * as Transpiler  from './transpiler.js';
import { JsonXYaml } from './structs/JsonXYaml.js';
import { BundlerCustoms } from '../typings/enums.js';
import { type AoiClient } from '../index.js';

export function Bundler(code: string, client: AoiClient) {
	const embedJs = parseEmbedJs(code);
	for (const ejs of embedJs) {
		code = code.replace(`\${${ejs}}`, BundlerCustoms.EJS);
	}

	const command  = parseExportCommand(code);

	command.code = Transpiler.transpiler((command.code as string), {
		scopeData:{
			embedJs: embedJs,
		},
		sendMessage: true,
		minify: true,
		reverse: command.reverse as boolean ?? false,
		client,
	}).func;

	return  {
		command:command,
		embedJs,
	};
}

// this function will get js code from ${} or nested ${} in a string and return it
export function parseEmbedJs(fileData: string) {
	let counter = 0;
	let isPotentialStart = false;
	let temp = '';
	const embedJs: string[] = [];
	for (let i = 0; i < fileData.length; i++) {
		const char = fileData[i];
		if (char === '$') {
			if (counter) {
				temp += char;
			}

			if (!isPotentialStart) {
				isPotentialStart = true;
			}
		} else if (char === '{') {
			if (isPotentialStart && !counter) {
				counter++;
			} else if (counter) {
				temp += char;
				counter++;
			}
		} else if (char === '}') {
			if (counter) {
				counter--;
				if (counter === 0) {
					embedJs.push(temp);
					temp = '';
					isPotentialStart = false;
				} else {
					temp += char;
				}
			} else if (isPotentialStart) {
				isPotentialStart = false;
			}
		} else {
			if (counter) {
				temp += char;
			}
		}
	}

	if (counter) {
		throw new Error('Invalid embed js');
	}

	return embedJs;
}

export function getCodeFromString(s: string) {
	return s.split('@{').slice(1).join('@{').split('}').slice(0, -1).join('}').trim();
}

export function parseExportCommand(s: string) {
	const commandTypeMatchArray = /\[exportCommand:\s*(\w+)\]/.exec(s);
	if (!commandTypeMatchArray) {
		throw new Error('Invalid export command');
	}

	const commandType = commandTypeMatchArray[1];
	let command = s.split(commandTypeMatchArray[0])[1].trim();
	command = command.slice(1, command.length - 1);

	const code = getCodeFromString(command);
	command = command.replace(code, code.replaceAll('{', BundlerCustoms.LB).replaceAll('}', BundlerCustoms.RB));
	const jsonxyaml = new JsonXYaml(command);
	const obj = jsonxyaml.toObject();
	obj.type = commandType;
	obj.code = (obj.code as string).replaceAll(BundlerCustoms.LB, '{').replaceAll(BundlerCustoms.RB, '}');
	return obj;
}

