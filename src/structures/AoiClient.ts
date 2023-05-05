import { Cacher, Client, createCacheManager } from "aoiluna";
import { AoiClientOptions } from "../typings/interfaces.js";
import { CommandManager } from "../manager/Command.js";
import { onMessage } from "../events/messageCreate.js";
import { Util } from "./Util.js";
import { FunctionManager } from "../manager/Function.js";

export class AoiClient
{
    client:Client;
    managers: {
        commands: CommandManager;
        functions: FunctionManager;
    };
    options: AoiClientOptions;
    cache?: Cacher;
    util:Util;
    constructor ( options: AoiClientOptions )
    {
        this.client = new Client( options );
        this.managers = {
            commands: new CommandManager( this ),
            functions: new FunctionManager( this )
        };
        this.options = options;
        if(options.caches)
            this.cache = createCacheManager(options.caches, this.client);

        this.#bindEvents();
        this.util = Util;
        Util.client = this;
    }
    #bindEvents ()
    {
        for ( const event of this.options.events )
            if ( event === "MessageCreate" ) onMessage( this );
    }
}