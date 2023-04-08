import { Cacher, Client, createCacheManager } from "aoiluna";
import { AoiClientOptions } from "../typings/interfaces.js";
import { CommandManager } from "../manager/Command.js";
import { onMessage } from "../events/messageCreate.js";

export class AoiClient
{
    client:Client;
    cmds: CommandManager;
    options: AoiClientOptions;
    cache?: Cacher;
    constructor ( options: AoiClientOptions )
    {
        this.client = new Client( options );
        this.cmds = new CommandManager();
        this.options = options;
        if(options.caches)
            this.cache = createCacheManager(options.caches, this.client);

        this.#bindEvents();
    }
    #bindEvents ()
    {
        for ( const event of this.options.events )
            if ( event === "MessageCreate" ) onMessage( this );
    }
}