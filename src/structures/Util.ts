import { Snowflake, User } from "aoiluna";
import { AoiClient } from "./AoiClient.js";
import { Group } from "@akarui/structures";

export class Util {
    static client:AoiClient;
    static async getUser(id:Snowflake) {
        if(this.client.cache?.users) return this.client.cache.users.get(id);
        else return await this.client.client.getUser(id);
    }
    static findUser(name:string) {
        if(this.client.cache?.users) return (<Group<Snowflake,User>>this.client.cache.users).find(u => u.username === name || u.tag === name);
        else return undefined;
    }
}