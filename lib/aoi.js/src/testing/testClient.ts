import AoiClient from '@aoi.js/classes/AoiClient.js';
<<<<<<< HEAD
import { ReturnType } from '@aoi.js/typings/enum.js';
import JSON5 from 'json5';

class TestClient extends AoiClient {
	constructor() {
		super({ testMode: true, token: 'token.a.b', 'intents': 0, prefix: '.', events: [] });
	// code...
	}

	parseData(output: string, type: ReturnType) {
		if (output === '') return output;
		
		switch (type) {
			case ReturnType.String: return output;
			case ReturnType.Number: return Number(output);
			case ReturnType.Boolean: return output === 'true';
			case ReturnType.Object: JSON5.parse(output);
			case ReturnType.Array: return JSON5.parse<unknown[]>(output);
			default: return output;
		}
	} 
=======

class TestClient extends AoiClient {
	constructor() {
		super({ testMode: true, token: 'token.a.b', 'intents': 0, prefix: '!', events: [] });
	// code...
	}
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
}

export default TestClient;