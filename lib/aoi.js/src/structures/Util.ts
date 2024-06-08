import { type Guild, type Snowflake, type User } from 'zeneth';
import { type AoiClient } from './AoiClient.js';
import { type Group } from '@akarui/structures';

export class Util {
	client: AoiClient;
	constructor(client: AoiClient) {
		this.client = client;
	}

	async getUser(id: Snowflake) {
		if (this.client.cache?.users) return this.client.cache.users.get(id);
		else return this.client.client.getUser(id);
	}

	findUser(name: string) {
		if (this.client.cache?.users)
			return ((this.client.cache.users as unknown) as Group<Snowflake, User>).find((u) => u.username === name || u.tag === name);
		else return undefined;
	}

	async getGuild(id: Snowflake) {
		if (this.client.cache?.guilds) return this.client.cache.guilds.get(id) as Guild;
		else return this.client.client.getGuild(id);
	}
}
