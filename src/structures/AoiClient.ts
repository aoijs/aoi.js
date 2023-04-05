import { Cacher, Client } from "aoiluna";
import { AoiClientOptions } from "../typings/interfaces.js";
import { CommandManager } from "../manager/Command.js";

export class AoiClient
{
    client:Client
    cmds: CommandManager;
    options: AoiClientOptions;
    cache?: Cacher;
    constructor ( options: AoiClientOptions )
    {
        this.client = new Client( options );
        this.cmds = new CommandManager();
        this.options = options;
        if(options.caches)
            this.cache = new Cacher(options.caches);
    }
}