import AoiClient from '@aoi.js/classes/AoiClient.js';

class TestClient extends AoiClient {
	constructor() {
		super({ testMode: true, token: 'token.a.b', 'intents': 0, prefix: '!', events: [] });
	// code...
	}
}

export default TestClient;