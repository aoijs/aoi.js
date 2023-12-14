import { Guild, Snowflake, User } from "zeneth";
import { AoiClient } from "./AoiClient.js";
import { Group } from "@akarui/structures";

export class Util {
    client: AoiClient;
    constructor(client: AoiClient) {
        this.client = client;
    }
    async getUser(id: Snowflake) {
        if (this.client.cache?.users) return this.client.cache.users.get(id);
        else return await this.client.client.getUser(id);
    }
    findUser(name: string) {
        if (this.client.cache?.users)
            return (<Group<Snowflake, User>>(
                (<unknown>this.client.cache.users)
            )).find((u) => u.username === name || u.tag === name);
        else return undefined;
    }
    async getGuild(id: Snowflake) {
        if (this.client.cache?.guilds) return this.client.cache.guilds.get(id) as Guild;
        else return await this.client.client.getGuild(id);
    }
}
