import type AoiClient from '@aoi.js/classes/AoiClient.js';
import { type IFunctionData } from '@aoi.js/typings/interface.js';

export default class FunctionManager {
	customs: Record<string, IFunctionData>;
	readonly #client: AoiClient;

	constructor(client: AoiClient) {
		this.#client = client;
		this.customs = {};
	}

	addFunction(name: string, data: IFunctionData) {
		this.customs[name] = data;
	}

	addToTranspiler() {
		this.#client.transpiler.addFunctions(this.customs);
	}
}
