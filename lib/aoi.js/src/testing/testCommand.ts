import Command from '@aoi.js/classes/Command.js';
import type TestClient from './testClient.js';

export default class TestCommand extends Command {
	constructor(client: TestClient) {
		super(
			{
				name: 'test',
				code: 'test',
				type: 'basic',
				__path__: 'root',
			},
			client,
		);
	}
}
