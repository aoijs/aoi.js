import AoiClient from '@aoi.js/classes/AoiClient';

class TestClient extends AoiClient {
	constructor() {
		super({ testMode: true, token: 'token.a.b', 'intents': 0, prefix: '!' });
	// code...
	}
}

export default TestClient;