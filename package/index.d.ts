declare module "aoi.js"{
    import {Client, Collection, ShardingManager} from "discord.js";
    import {EventEmitter} from "events";
//-----------Class Client----------------//

    type DatabaseOptions = {
        db : "default"|module;
        promisify:boolean;
        tables: Array<string>;
        path: string;
    }
    type  ClientOptions = {
        token : string;
        prefix : Array<string> | string;
        database: DatabaseOptions;
        mobilePlatform : boolean;
        respondOnEdit:{
            alwaysExecute:boolean;
            command:boolean;
            nonPrefixed:boolean;
            timeLimit: number;
        };
        suppressAllErrors:boolean;
        errorMessage:array;
        debugs:{
            interpreter:boolean;
        };
        events:{
            music:boolean;
            timeout:boolean;
            functionError:boolean;
        };
        autoUpdate:boolean;
        fetchInvites:{
            enabled:boolean;
            cacheInviters:boolean;
        };
        dbhToken: string;
    }
    class Bot {
        options : ClientOptions 
        constructor(options : ClientOptions);
}
//---------------------------------------//
//-------------ClientShard---------------//
type ShardOptions = {
    totalShards? : "auto" | number;
    shardList?: "auto" | Array<number>;
    mode? : "process" | "worker";
    respawn? : boolean;
    shardArgs? : Array<string>;
    execArgv? : string;
    token? : string;
}
class ClientShard extends ShardingManager{
file: string;
options:ShardOptions;
client: Bot;
constructor(file:string,options:ShardOptions,client:Bot);
public onShardError();
public onShardDisconnect();
public shardErrorCommand(options:{
    name?:string;
    code: string;
    channel?:string;
});
public shardDisconnectCommand(options:{
    name?:string;
    code:string;
    channel?:string;
    });
}
//---------------------------------------//
//-------------LoadCommands--------------//
class LoadCommands {
    client:Bot;
    addToClientClass?:boolean;
    constructor(client:Bot ,addToClientClass: boolean);
    public load(path:string,debug?:boolean);
    public update(debug?:boolean);
}
//---------------------------------------//
//---------------Voice-------------------//
 type Ytdl = {
     filter:"audio"|"audioOnly";
     quality:"highestaudio"|"lowestaudio"|"highest"|"lowest";
     cookie?:string;
     proxy?:string;
     agent?:string;
 };
 type SoundCloud = {
     agent?:string;
     SoundCloudID?:string;
 };
 type Cache = {
     enabled:boolean;
     limit:number;
 }
    class Voice {
        client:Bot;
        ytOptions?:Ytdl;
        scOptions?: SoundCloud;
        cacheOptions?:Cache 
        constructor(client:Bot,ytOptions:Ytdl,scOptions: SoundCloud,cacheOptions:Cache);
    }
//---------------------------------------//
//------------CustomEvents---------------//
    class CustomEvents extends EventEmitter {
        client:Bot;
        constructor(client:Bot);
        public command(d:{
            channel?:string;
            name:string;
            code:string;
            listen: string;
        });
    }
//---------------------------------------//
//---------------AoiError----------------//
    type MessageEmbed = {
        title?:string;
        url?:string;
        author?:{
            name:string;
            iconURL?:string;
            url?:string;
        };
        thumbnail?:{
            url:string;
        };
        image?:{
            url: string|null
        };
        footer?:{
            text:string;
            iconURL:string;
        };
        description?: string;
        fields:Array<{name:string;value:any,inline:boolean}>;
        color:string|number;
    }
    type MessageOptions ={
        content: string;
        embeds:Array<MessageEmbed>;
        files:Array<{name: string, attachment:buffer|string,file:buffer|string};

    }
    class AoiError{
       private constructor();
       private static CallbackError(options:{callback:string,intent:string});
       private static CommandError(options:{command: string,type:"name"|"code",name:string,position:number});
        public static makeMessageError(client:Bot,channelID:string,options:MessageOptions);
    }
//---------------------------------------//
}
