const Discord = require("discord.js");
const axios = require('axios')
const DBDdb = require("dbdjs.db");
const snowflake = Discord.SnowflakeUtil
const WorkerPool = require("../handlers/workerPool");
const searchIndexes = require("../handlers/KMP");
const Lavalink = require("./Lavalink.js");
const interpreter = require("../interpreter.js");

const Interaction = require("./Interaction");
const CustomEvent = require("./customEvent.js");
const opts = require("../utils/options");
const API = require("../handlers/boosterAPI.js");

const Database = new DBDdb.Database({
  path: "./new-database/",
  tables: [
    {
      name: "main",
    },
  ],
  maxFileData: 10000,
  cacheMaxSize: 10000,
  saveTime: 3,
  getTime: 1,
  allTime: 2,
  deleteTime: 4,
});

const LavalinkTimeoutFunction = function (d) {
  return () => {
    const lavalinkTimeout = d.client.lavalink.timeouts;
    const Player = d.client.lavalink.get(d.guildId);

    if (player.state !== "PLAYING") {
      Player.stop();
      Player.ws.send({
        op: "destroy",
        guildId: d.guildId,
      });
      Player.sendCallback(d.guildId, leaveBody);
      d.client.lavalink.servers.delete(d.guildId);
      clearTimeout(lavalinkTimeout.get(d.guildId));
      lavalinkTimeout.delete(d.guildId);
    } else {
      clearTimeout(lavalinkTimeout.get(d.guildId));
      lavalinkTimeout.delete(d.guildId);
    }
  };
};
const shardingClient = require("../handlers/shardingClient.js");
const client = new Discord.Client({
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "USER", "REACTION"],
});

client.ytSearch = new WorkerPool(
  0,
  {
    filename: require.resolve("../handlers/ytSearch"),
  },
  (meta, id, status) => {
    if (!status) {
      if (meta.message) return;

      return Error(meta);
    }

    if (meta.duration) {
      meta.duration.toString = () => {
        return toDuration(meta.duration.seconds);
      };
    } else if (Array.isArray(meta.videos)) {
      let i = 0;

      while (i < meta.videos.length) {
        const video = meta.videos[i++];

        if (video.duration) {
          video.duration.toString = () => {
            return toDuration(video.duration.seconds);
          };
        }
      }
    }
  }
);

function toDuration(lengthSeconds) {
  const time = require("parse-ms")(lengthSeconds * 1000);

  const secs = `0${time.seconds % 60}`.substr(-2);
  const mins = `0${time.minutes % 60}`.substr(-2);
  const hours = `0${time.hours % 60}`.substr(-2);
  const iso = [hours, mins, secs];

  if (time.days) iso.unshift(time.days);

  return `${lengthSeconds} Seconds (${iso.join(":")})`;
}

client.db = Database;

client.customFunctions = {};
async () => {
  const previousDate = Date.now();
  const previousUsage = process.cpuUsage();

  setTimeout(() => {
    const usage = process.cpuUsage(previousUsage);
    const result =
      (100 * (usage.user + usage.system)) /
      ((Date.now() - previousDate) * 1000);

    client.cpu = result;
  }, 5000);
};

setInterval(() => {
  const previousDate = Date.now();
  const previousUsage = process.cpuUsage();

  setTimeout(() => {
    const usage = process.cpuUsage(previousUsage);
    const result =
      (100 * (usage.user + usage.system)) /
      ((Date.now() - previousDate) * 1000);

    client.cpu = result;
  }, 5000);
}, 5000);

const ForceDisconnect = require("../handlers/ForceDisconnect.js");

client.on("voiceStateUpdate", async (oldState, newState) => {
  ForceDisconnect(client, oldState, newState);

  const oldChannel = oldState.channel;
  const newChannel = newState.channel;

  if (
    (oldChannel && !newChannel) ||
    (oldChannel && newChannel && oldChannel.id !== newChannel.id)
  ) {
    if (
      newState.member.id === newState.client.user.id ||
      (newChannel &&
        oldChannel.id !== newChannel.id &&
        client.user.id === newState.member.id &&
        !newChannel.members.filter((m) => !m.user.bot).size)
    ) {
      const server = newState.client.servers.get(oldChannel.guild.id);

      if (newChannel && server)
        client.emit("musicEnd", server), newChannel.leave();

      return client.servers.delete(oldChannel.guild.id);
    }

    const server = newState.client.servers.get(newState.guild.id);

    if (
      server &&
      server.leave &&
      oldChannel.id === oldChannel.guild.me.voice.channelID
    ) {
      if (
        !client.channels.cache
          .get(oldChannel.id)
          .members.filter((m) => !m.user.bot).size
      ) {
        server.connection.dispatcher.end();
        server.songs = [];
      }
    }
  }
});

client._api = (url) =>
  `https://discord.com/api/v9/${url.startsWith("/") ? url.slice(1) : url}`;
//DBD.JS :)
const fs = require("fs");
client.cpu = 0.01313515189;
client.applications = {
    slash: new Discord.Collection()
    }
client.voice_state_update_commands = new Discord.Collection();
client.member_update_commands = new Discord.Collection();
client.loop_commands = new Discord.Collection();
client.guild_update_commands = new Discord.Collection();
client.channel_pins_update_commands = new Discord.Collection();
client.webhook_update_commands = new Discord.Collection();
client.message_delete_bulk_commands = new Discord.Collection();
client.emoji_update_commands = new Discord.Collection();
client.emoji_delete_commands = new Discord.Collection();
client.emoji_create_commands = new Discord.Collection();
client.channel_update_commands = new Discord.Collection();
client.channel_delete_commands = new Discord.Collection();
client.channel_create_commands = new Discord.Collection();
client.role_delete_commands = new Discord.Collection();
client.role_update_commands = new Discord.Collection();
client.role_create_commands = new Discord.Collection();
client.presence_commands = new Discord.Collection();
client.user_update_commands = new Discord.Collection();
client.ratelimit_commands = new Discord.Collection();
client.timeout_commands = new Discord.Collection();
client.typing_commands = new Discord.Collection();
client.slash_commands = new Discord.Collection();
client.invite_create_commands = new Discord.Collection();
client.bot_leave_commands = new Discord.Collection();
client.invite_delete_commands = new Discord.Collection();
client.ban_add_commands = new Discord.Collection();
client.ban_remove_commands = new Discord.Collection();
client.music_start_commands = new Discord.Collection();
client.music_end_commands = new Discord.Collection();
client.bot_join_commands = new Discord.Collection();
client.collections = {};
client.servers = new Discord.Collection();
client.update_commands = new Discord.Collection();
client.join_commands = new Discord.Collection();
client.bot_commands = new Discord.Collection();
client.deleted_commands = new Discord.Collection();
client.ready_commands = new Discord.Collection();
client.variables = {};
client.statuses = new Discord.Collection();
client.leave_commands = new Discord.Collection();
client.awaited_commands = new Discord.Collection();
client.reaction_add_commands = new Discord.Collection();
client.reaction_remove_commands = new Discord.Collection();
client.timeout_pulse_commands = new Discord.Collection();

client.function_error_commands = new Discord.Collection()
client.variable_create_commands = new Discord.Collection()
client.variable_update_commands = new Discord.Collection()
client.variable_delete_commands = new Discord.Collection()
client.application_cmd_create_commands = new Discord.Collection() 
client.application_cmd_update_commands = new Discord.Collection() 
client.application_cmd_delete_commands = new Discord.Collection() 

const InteractionCreate = require("../events/interactionCreate");
const InviteCreate = require("../events/inviteCreate");
const InviteDelete = require("../events/inviteDelete");
const GuildBanAdd = require("../events/guildBanAdd");
const GuildBanRemove = require("../events/guildBanRemove");
const MusicStart = require("../events/musicStart");
const MusicEnd = require("../events/musicEnd");
const GuildCreate = require("../events/guildCreate");
const GuildDelete = require("../events/guildDelete.js");
const MessageUpdate = require("../events/messageUpdate.js");
const ChannelPinsUpdate = require("../events/channelPinsUpdate.js");
const webhookUpdate = require("../events/webhookUpdate.js");
const MessageDeleteBulk = require("../events/messageDeleteBulk.js");
const Message = require("../events/message.js");
const Ready = require("../events/ready.js");
const MessageDelete = require("../events/messageDelete.js");
const GuildMemberAdd = require("../events/guildMemberAdd.js");
const GuildMemberRemove = require("../events/guildMemberRemove.js");
const MessageReactionAdd = require("../events/messageReactionAdd.js");
const MessageReactionRemove = require("../events/messageReactionRemove.js");

const CustomError = require ("../handlers/errorCommands.js");
const VarCreate = require("../handlers/variableCreateCommands.js");
const VarUpdate = require("../handlers/variableUpdateCommands.js");
const VarDelete = require("../handlers/variableDeleteCommands.js");
const AppCmdCreate = require("../handlers/applicationCreateCommands.js");
const CheckGlobalSlashCreate = require("../handlers/checkGlobalSlashCreate.js");
const CheckSlashUpdate = require("../handlers/checkSlashUpdate.js");
const AppCmdUpdate = require("../handlers/applicationUpdateCommands.js");
const AppCmdDelete= require("../handlers/applicationDeleteCommands.js");

require("../handlers/UpdateWarning")();
const parser = require("../functions/parser");
/**
 * The Class that log in the Discord bot to Discord
 * @param options Object The options for logging in
 * @example
 *
 *
 *            new Client({token:"Discord Bot Token", prefix:"!"})
 */

class Client {
  constructor(
    options = {
      sharding: false,
      shardAmount: null,
      mobile: false,
      typingStopEvent: false,
      disabledFunctions: [],
      disabledFunctionsStarting: [],
      fetchInvites: false,
      boosterToken: null,
      applicationCache: true
    }
  ) {
client.aoi = {
   options: options 
    }

    if (options.typingStopEvent)
      client.on("typingStart", (channel, user) =>
        require("../handlers/typingStopHandling")(client, channel, user)
      );

    client.bot = this;
    this.client = client;
    this.paths = [];

    //this.loadUtils()

    client.options.fetchInvites = options.fetchInvites;

    if (options.boosterToken) {
      API(options.boosterToken);
    }

    if (
      Array.isArray(options.disabledFunctions) &&
      options.disabledFunctions.length
    ) {
      options.disabledFunctions.map((func) => delete parser[func]);
    }

    if (Array.isArray(options.disabledFunctionsStarting)) {
      Object.keys(parser)
        .filter((d) =>
          options.disabledFunctionsStarting.map((p) => p.startsWith(d))
        )
        .map((f) => delete parser[f]);
    }

    if (options.mobile) {
      Discord.Constants.DefaultOptions.ws.properties.$browser =
        "Discord Android";

      console.log(`Enabled mobile presence`);
    }

    if (options.sharding) {
      if (options.shardAmount) {
        client.shards = options.shardAmount;
      } else client.shards = "auto";

      console.log(`Sharding...`);
    }
    if (options.autoUpdate) {
      require("../handlers/AutoUpdate")();
    }

    if (options.dbhToken) client.dbhToken = options.dbhToken;

    if (!options.token) throw new TypeError(`Token wasn't provided.`);

    if (!options.prefix) throw new TypeError(`Prefix wasn't provided.`);

    client.prefix =
      typeof options.prefix === "string" ? [options.prefix] : options.prefix;

    client.cookie =
      options.youtubeCookie ||
      "YSC=5yaGWYf3sb4; VISITOR_INFO1_LIVE=hRFBhbsmz-U; __Secure-3PSID=8Qc_mMTGhpfQdTm1-fdKq6rh9KNCUC9OONEP44RAQkvVrQrFDkgjRaj6vJdchtNXMrWd4w.; __Secure-3PAPISID=HElVHkUVenb2eFXx/AhvhxMhD_KPsM4nZE; PREF=tz=Asia.Jakarta; __Secure-3PSIDCC=AJi4QfE9ix2TVKVWZzmswEkeDpCcZnuScw9N2pu2dS2fGx1Nyrtv_uDH4vvaiujL82_Ys1OO";

    client.on("musicStart", (server, old) => MusicStart(client, server, old));
    client.on("musicEnd", (server, old) => MusicEnd(client, server, old));

    client.on("timeoutPulse", (data) =>
      require("../events/timeoutExpire")(client, data, true)
    );
    client.on("timeoutExpire", (data) =>
      require("../events/timeoutExpire")(client, data)
    );

    client.once("ready", () => {
      Ready(client);
    });

    if (options.database) {
      client.db = options.database;
    } else {
      Database.once("ready", () => {
        console.log(`Database ready!`);
      });

      Database.connect();
    }

if(options.applicationCache == true){
        client.once("ready",() =>{ 

    axios.get(client._api(`/applications/${client.user.id}/commands`), {

        headers: {

            Authorization: `Bot ${options.token}`

        }

    }).then(d=>{let i;
d = d.data
                let data;

for(i=0;d.length >i ;i++){

                if(d){

                data = {

                id: d[i].id,

                name: d[i].name,

                defaultPermission: d[i]. default_permission,

                application : client,

                guild : null, 

                version : d[i].version ,

                description: d[i]. description,

                options: d[i].options || [],
                    timestamp: snowflake.deconstruct(d[i].id).timestamp ,
                    createdAt :snowflake.deconstruct(d[i].id).date

                   }

                }

                else {

                    data = {

                        id:""

                        }

                    }

                

                   

                    client.applications.slash.set(data.id,data)}

    })

    })
        client.ws.on("APPLICATION_COMMAND_CREATE",(application) =>{
            const data = {

    id : application.id,

    version: application.version ,

    application: client,

    defaultPermission : application.default_permission ,

    name: application.name,

    description: application.description ,

    options: application.options ,

    guild: client.guilds.cache.get(application.guild_id)|| null ,

    timestamp :application.timestamp || Date.now() ,

    createdAt: application.createdAt || new Date()

    }
            client.applications.slash.set(data.id,data)
            })
 client.ws.on("APPLICATION_COMMAND_UPDATE",(d,olda)=>{
    
     
     let newData = {

       id: d.id,

       name: d.name,

       description:d.description,

       options: d.options || [],

       defaultPermission : d.default_permission ,

       guild : null ,

       application : client ,

       timestamp : Snowflake.deconstruct(d.id).timestamp,

       createdAt: Snowflake.deconstruct(d.id).date

       } 
     client.applications.slash.set(d.id,newData)
     })
            
            client.ws.on("APPLICATION_COMMAND_DELETE",(data) =>{
          client.applications.slash.delete(data.id)
                })
            }else{}

        client.on("checkGlobalSlashCreate",(type,name,client) =>{ CheckGlobalSlashCreate(type,name,client) 
                                })                                 
     client.on("checkSlashUpdate",(client,commandID,guildID,oldData) =>{ CheckSlashUpdate(client,commandID,guildID,oldData)
                                               })
        

    client.login(options.token).catch((err) => TypeError(`Invalid token`));
  }

  // creating Lavalink connection instance
  createLavalink(url, password, debug = false) {
    if (this.client.readyTimestamp) {
      this.__lavacon(url, password, debug);
    } else {
      client.once("ready", () => this.__lavacon(url, password, debug));
    }
  }

  __lavacon(u, p, d) {
    this.client.lavalink = new Lavalink({
      url: u,
      password: p,
      shardCount: this.client.shard ? this.client.shard.count : 0,
      userID: this.client.user.id,
      send: (guildId, packet) => {
        if (!guildId) return;
        if (guildId && this.client.guilds.cache.has(guildId)) {
          if (typeof this.client.ws.send !== "function") {
            return this.client.guilds.cache.get(guildId).shard.send(packet);
          }
          this.client.ws.send(packet);
        }
      },
    });
    this.client.lavalink.on("trackStart", (track, packet, guildId, mgr) => {
      clearTimeout(mgr.timeouts.get(guildId));
      mgr.timeouts.delete();
      client.emit("musicStart", mgr.get(guildId), null);
    });
    this.client.lavalink.on("trackEnd", (track, packet, guildId, mgr) => {
      const Player = mgr.get(guildId);
      clearTimeout(mgr.timeouts.get(guildId));
      mgr.timeouts.delete(guildId);

      if (!Player.queue.length && track === null && mgr.get(guildId)) {
        client.emit("musicEnd", mgr.get(guildId), null);

        mgr.timeouts.set(guildId, timeoutFunction({ client }));
      }
    });

    this.client.on("raw", async (p) =>
      this.client.lavalink.updateVoiceStates(p)
    );

    if (d) {
      this.client.lavalink.on("debug", (s) => console.log(s));
    }

    this.client.lavalink.on("error", () => {});
  }

  //utils loader
  /*loadUtils() {
      client.util = {} 
      
      for (const Util of fs.readdirSync("./package/utils/")) {
          client.util[Util.replace(".js", "")] = require(`../utils/${Util}`)
      }
  }*/

  channelUpdateCommand(d = {}) {
    client.channel_update_commands.set(
      Math.floor(Math.random() * 5939293959),
      d
    );
  }
  
  channelPinsUpdateCommand(d = {}) {
    client.channel_pins_update_commands.set(
      Math.floor(Math.random() * 5939293959),
      d
    );
  }
    
  webhookUpdateCommand(d = {}) {
    client.webhook_update_commands.set(
      Math.floor(Math.random() * 5939293959),
      d
    );
  }
    
  messageDeleteBulkCommand(d = {}) {
    client.message_delete_bulk_commands.set(
      Math.floor(Math.random() * 5939293959),
      d
    );
  }
    
  emojiUpdateCommand(d = {}) {
    client.emoji_update_commands.set(
      Math.floor(Math.random() * 5939293959),
      d
    );
  }
  emojiDeleteCommand(d = {}) {
    client.emoji_delete_commands.set(
      Math.floor(Math.random() * 5939293959),
      d
    );
  }
  emojiCreateCommand(d = {}) {
    client.emoji_create_commands.set(
      Math.floor(Math.random() * 5939293959),
      d
    );
  }
  
  guildUpdateCommand(d = {}) {
    client.guild_update_commands.set(
      Math.floor(Math.random() * 5993838594992),
      d
    );
  }
  
  memberUpdateCommand(d = {}) {
    client.member_update_commands.set(client.member_update_commands.size, d);
  }

  channelDeleteCommand(d = {}) {
    client.channel_delete_commands.set(
      Math.floor(Math.random() * 5939293959),
      d
    );
  }
  
  channelCreateCommand(d = {}) {
    client.channel_create_commands.set(
      Math.floor(Math.random() * 5939293959),
      d
    );
  }
  interactionCommand(d = {}) {
    client.slash_commands.set(Math.floor(Math.random() * 58288384832), d);
  }

  presenceUpdateCommand(d = {}) {
    client.presence_commands.set(Math.floor(Math.random() * 84584839392929), d);
  }

  voiceStateUpdateCommand(d = {}) {
    client.voice_state_update_commands.set(
      client.voice_state_update_commands.size,
      d
    );
  }

  rateLimitCommand(d = {}) {
    client.ratelimit_commands.set(client.ratelimit_commands.size, d);
  }

  timeoutCommand(d = {}) {
    client.timeout_commands.set(client.timeout_commands.size, d);
  }

  roleDeleteCommand(d = {}) {
    client.role_delete_commands.set(
      Math.floor(Math.random() * 84584839392929),
      d
    );
  }

  roleCreateCommand(d = {}) {
    client.role_create_commands.set(Math.floor(Math.random() * 95833858483), d);
  }

  roleUpdateCommand(d = {}) {
    client.role_update_commands.set(
      Math.floor(Math.random() * 5993838594992),
      d
    );
  }
  timeoutPulseCommand(ops = {}) {
    client.timeout_pulse_commands.set(client.timeout_pulse_commands.size, ops);
  }

  userUpdateCommand(d = {}) {
    client.user_update_commands.set(
      Math.floor(Math.random() * 5993838594992),
      d
    );
  }

  deletedCommand(d = {}) {
    client.deleted_commands.set(Math.floor(Math.random() * 5838838494939), d);
  }

  botJoinCommand(d = {}) {
    client.bot_join_commands.set(Math.floor(Math.random() * 589392939392), d);
  }

  botLeaveCommand(d = {}) {
    client.bot_leave_commands.set(Math.floor(Math.random() * 488384848338), d);
  }

  readyCommand(d = {}) {
    client.ready_commands.set(Math.floor(Math.random() * 5838838494939), d);
  }

  reactionAddCommand(d = {}) {
    client.reaction_add_commands.set(
      Math.floor(Math.random() * 5838838494939),
      d
    );
  }

  reactionRemoveCommand(d = {}) {
    client.reaction_remove_commands.set(
      Math.floor(Math.random() * 5838838494939),
      d
    );
  }

  typingStartCommand(ops = {}) {
    client.typing_commands.set(client.typing_commands.size, ops);
  }

  banAddCommand(d = {}) {
    client.ban_add_commands.set(Math.floor(Math.random() * 4982838484), d);
  }

  banRemoveCommand(d = {}) {
    client.ban_remove_commands.set(Math.floor(Math.random() * 49588393), d);
  }

  inviteCreateCommand(d = {}) {
    client.invite_create_commands.set(Math.floor(Math.random() * 294484839), d);
  }

  inviteDeleteCommand(d = {}) {
    client.invite_delete_commands.set(
      Math.floor(Math.random() * 3949583929),
      d
    );
  }
  awaitedCommand(d = {}) {
    client.awaited_commands.set(Math.floor(Math.random() * 5838838494939), d);
  }

  leaveCommand(d = {}) {
    client.leave_commands.set(Math.floor(Math.random() * 5838838494939), d);
  }

  updateCommand(d = {}) {
    client.update_commands.set(Math.floor(Math.random() * 5838838494939), d);
  }

  musicStartCommand(d = {}) {
    client.music_start_commands.set(Math.floor(Math.random() * 583828848), d);
  }

  musicEndCommand(d = {}) {
    client.music_end_commands.set(Math.floor(Math.random() * 583828848), d);
  }

  joinCommand(d = {}) {
    if (!d.channel)
      throw new Error(
        `Join Command ${client.join_commands.size} needs a channel!`
      );

    if (!d.code)
      throw new Error(
        `Join Command ${client.join_commands.size} needs a code! `
      );

    d.id = Math.floor(Math.random() * 494993848489);

    client.join_commands.set(d.id, d);
  }

functionErrorCommand(d = {}) {
    if (!d.channel)
      throw new Error(
        `Error Command ${client.function_error_commands.size} needs a channel!`
      );   
    d.id = Math.floor(Math.random() * 494993848489);
    client.function_error_commands.set(d.id, d);
  }
    
    variableCreateCommand(d = {}) {
    if (!d.channel)
      throw new Error(
        `Error Command ${client.variable_create_commands.size} needs a channel!`
      );   

    d.id = Math.floor(Math.random() * 494993848489);
    client.variable_create_commands.set(d.id, d);
  }
       variableUpdateCommand(d = {}) {
    if (!d.channel)
      throw new Error(
        `Error Command ${client.variable_update_commands.size} needs a channel!`
      );    

    d.id = Math.floor(Math.random() * 494993848489);
    client.variable_update_commands.set(d.id, d);
  }
    variableDeleteCommand(d = {}) {
   if (!d.channel)
      throw new Error(
        `Error Command ${client.variable_delete_commands.size} needs a channel!`
     );    
     

    d.id = Math.floor(Math.random() * 494993848489);
    client.variable_delete_commands.set(d.id, d);
  }   
    applicationCmdCreateCommand(d = {}) {

    if (!d.channel)

      throw new Error(

        `Error Command ${client.application_cmd_create_commands.size} needs a channel!`

      );

    

     

    d.id = Math.floor(Math.random() * 494993848489);

    client.application_cmd_create_commands.set(d.id, d);

  }
    applicationCmdUpdateCommand(d = {}) {

    if (!d.channel)

      throw new Error(

        `Error Command ${client.application_cmd_update_commands.size} needs a channel!`

      );

    

     

    d.id = Math.floor(Math.random() * 494993848489);

    client.application_cmd_update_commands.set(d.id, d);

  }
    applicationCmdDeleteCommand(d = {}) {

    if (!d.channel)

      throw new Error(

        `Error Command ${client.application_cmd_delete_commands.size} needs a channel!`

      );

    

     

    d.id = Math.floor(Math.random() * 494993848489);

    client.application_cmd_delete_commands.set(d.id, d);

  }

  status(
    d = {
      type: new String(),
      text: new String(),
      time: 12,
      url: new String(),
    }
  ) {
    client.statuses.set(client.statuses.size, d);
  }

  loopCommand(
    opts = {
      every: null,
      executeOnStartup: false,
      channel: null,
      code: null,
    }
  ) {
    const interval = require("../handlers/loopCommands")(client, opts);

    opts.loopInterval = interval;

    client.loop_commands.set(client.loop_commands.size, opts);
  }
  command(...args) {
    for (const d of args) {
      if (!d.name)
        throw new TypeError(
          `Command ${client.bot_commands.size} needs a name!`
        );

      if (!d.code)
        throw new TypeError(
          `Command ${client.bot_commands.size} needs a code!`
        );

      d.id = Math.floor(Math.random() * 58939248388);

      client.bot_commands.set(d.id, d);
    }
  }

  //Better loadCommands™️
  async loadCommands(path, debug = true) {
    if (typeof path !== "string")
      throw new TypeError(
        `Expecting typeof string on 'path' parameter, get '${typeof path}' instead`
      );

    if (!require("path").isAbsolute(path)) path = require("path").resolve(path);

    try {
      if (await fs.promises.stat(path).then((f) => !f.isDirectory()))
        throw new Error("e");
    } catch {
      throw new TypeError("Path is not a valid directory!");
    }

    const index = this.paths.findIndex((d) => d.path === path);

    if (index < 0)
      this.paths.push({
        path,
        debug,
      });

    const validCmds = Object.getOwnPropertyNames(Client.prototype).filter(
      (n) => {
        return n.toLowerCase().endsWith("command");
      }
    );

    const dirents = await walk(path);
    const debugs = [];

    for (const { name } of dirents) {
      delete require.cache[name];

      let cmds;

      try {
        cmds = require(name);
      } catch {
        debugs.push(`| Failed to walk in ${name}`);

        continue;
      }

      if (cmds == null) {
        debugs.push(`| No data provided in ${name}`);

        continue;
      }

      if (!Array.isArray(cmds)) cmds = [cmds];

      debugs.push(`| Walking in ${name}`);

      for (const cmd of cmds) {
        if (!isObject(cmd)) {
          debugs.push(`| Provided data is not an object`);

          continue;
        }

        if (!("type" in cmd)) cmd.type = "command";

        const valid = validCmds.some((c) => c === cmd.type);

        if (!valid) {
          debugs.push(
            `| Invalid command type '${cmd.type}' at ${cmd.name || cmd.channel}`
          );

          continue;
        }

        cmd.load = true;

        try {
          this[cmd.type](cmd);
        } catch {
          debugs.push(
            `| Failed to load '${cmd.name || cmd.channel}' (${cmd.type})`
          );

          continue;
        }

        debugs.push(`| Loaded '${cmd.name || cmd.channel}' (${cmd.type})`);
      }
    }

    if (debug) {
      console.log(
        "|------------------------------------------|\n" +
          debugs.join("\n") +
          "\n|------------------------------------------|"
      );
    }

    function isObject(data) {
      return (
        data instanceof Object &&
        !Buffer.isBuffer(data) &&
        !Array.isArray(data) &&
        !(data instanceof RegExp)
      );
    }

    async function walk(path) {
      const something = await fs.promises
        .readdir(path, { withFileTypes: true })
        .then((f) => {
          return f.map((d) => {
            d.name = `${path}/${d.name}`;

            return d;
          });
        });

      const files = something.filter((d) => d.isFile());
      const dirs = something.filter((d) => d.isDirectory());

      for (const d of dirs) {
        const items = await walk(d.name);

        files.push(...items);
      }

      return files;
    }
  }

  createCustomEvent(EventEmitter) {
    return new CustomEvent(client, EventEmitter);
  }

  //events
  onMemberUpdate() {
    client.on("guildMemberUpdate", (oldm, newm) => {
      require("../events/guildMemberUpdate")(client, oldm, newm);
    });
  }
  //not accurate, might need a few seconds to detect the user, and must be enable within bot instance
  onTypingStop() {
    client.on("typingStop", (channel, user) =>
      require("../events/typingStop")(client, channel, user)
    );
  }

  onRateLimit() {
    client.on("rateLimit", (info) => {
      require("../events/rateLimit")(client, info);
    });
  }
  //already enabled if typingStopEvent property is set to true
  onTypingStart() {
    //if (client.options.typingStopEvent) return false

    client.on("typingStart", (channel, user) =>
      require("../events/typingStart")(client, channel, user)
    );
  }

  onVoiceStateUpdate() {
    client.on("voiceStateUpdate", (olds, news) => {
      require("../events/voiceStateUpdate")(client, olds, news);
    });
  }
  
  onChannelDelete() {
    client.on("channelDelete", (channel) =>
      require("../events/channelDelete")(client, channel)
    );
  }

  onChannelCreate() {
    client.on("channelCreate", (channel) =>
      require("../events/channelCreate")(client, channel)
    );
  }

  onChannelUpdate() {
    client.on("channelUpdate", (oldc, newc) =>
      require("../events/channelUpdate")(client, oldc, newc)
    );
  }
  
  onMessageDeleteBulk() {
    client.on("messageDeleteBulk", (bulk) => {
      require("../events/messageDeleteBulk")(client, bulk);
    });
  }
  
  onGuildUpdate() {
    client.on("guildUpdate", (oldg, newg) =>
      require("../events/guildUpdate")(client, oldg, newg)
    );
  }
  
     // event only provides data about the channel, not the message itself:
  onChannelPinsUpdate() {
    client.on("channelPinsUpdate", (pinch) =>
      require("../events/channelPinsUpdate")(client, pinch)
    );
  }
    
    // event only provides data about the channel, not the webhook itself:
  onWebhookUpdate() {
    client.on("webhookUpdate", (whc) =>
      require("../events/webhookUpdate")(client, whc)
    );
  }
    
  onEmojiUpdate() {
    client.on("emojiUpdate", (olde, newe) =>
      require("../events/emojiUpdate")(client, olde, newe)
    );
  }
  
   onEmojiDelete() {
    client.on("emojiDelete", (emoji) =>
      require("../events/emojiDelete")(client, emoji)
    );
  }
  
  onEmojiCreate() {
    client.on("emojiCreate", (emoji) =>
      require("../events/emojiCreate")(client, emoji)
    );
  }
  
  onRoleUpdate() {
    client.on("roleUpdate", (oldr, newr) =>
      require("../events/roleUpdate")(client, oldr, newr)
    );
  }

  onRoleDelete() {
    client.on("roleDelete", (role) =>
      require("../events/roleDelete")(client, role)
    );
  }

  onRoleCreate() {
    client.on("roleCreate", (role) =>
      require("../events/roleCreate")(client, role)
    );
  }
  onPresenceUpdate() {
    client.on("presenceUpdate", (oldp, newp) =>
      require("../events/presenceUpdate")(client, oldp, newp)
    );
  }
  onUserUpdate() {
    client.on("userUpdate", (old, newu) =>
      require("../events/userUpdate")(client, old, newu)
    );
  }

  onInteractionCreate() {
    client.ws.on("INTERACTION_CREATE", (data) => {
      InteractionCreate(client, new Interaction(client, data));
    });
  }

  onInviteCreate() {
    client.on("inviteCreate", (invite) => InviteCreate(client, invite));
  }

  onInviteDelete() {
    client.on("inviteDelete", (invite) => InviteDelete(client, invite));
  }
  onBanAdd() {
    client.on("guildBanAdd", (guild, user) => GuildBanAdd(client, guild, user));
  }

  onBanRemove() {
    client.on("guildBanRemove", (guild, user) =>
      GuildBanRemove(client, guild, user)
    );
  }

  onMessage(
    options = {
      guildOnly: true,
      respondToBots: false,
    }
  ) {
    client.messageEventOptions = options;

    client.on("message", async (message) => Message(client, message, null));
  }

  onGuildJoin() {
    client.on("guildCreate", (guild) => GuildCreate(client, guild));
  }

  onGuildLeave() {
    client.on("guildDelete", (guild) => GuildDelete(client, guild));
  }

  onJoined() {
    client.on("guildMemberAdd", (member) =>
      GuildMemberAdd(client, member, client.db)
    );
  }

  onReactionAdd() {
    client.on("messageReactionAdd", (reaction, user) =>
      MessageReactionAdd(client, reaction, user, client.db)
    );
  }

  onReactionRemove() {
    client.on("messageReactionRemove", (reaction, user) =>
      MessageReactionRemove(client, reaction, user, client.db)
    );
  }

  onLeave() {
    client.on("guildMemberRemove", (member) =>
      GuildMemberRemove(client, member, client.db)
    );
  }

  onMessageUpdate() {
    client.on("messageUpdate", (omsg, msg) =>
      MessageUpdate(client, omsg, msg, client.db)
    );
  }

  onMessageDelete() {
    client.on("messageDelete", (msg) => MessageDelete(client, msg, client.db));
  }

  onFunctionError() {

    client.on("CUSTOM_ERROR", (client,err,db,command,message) => CustomError(client, err, client.db,command,message));

  }
    
    onVariableCreate() {

    client.on("VARIABLE_CREATE", (client,db, variables,keys, values, timestamp) => VarCreate(client,client.db,variables,keys, values, timestamp));

  }
    
    onVariableUpdate() {

    client.on("VARIABLE_UPDATE", (client,db,oldv,newv) => VarUpdate(client,client.db,oldv,newv));

  }

    onVariableDelete() {

    client.on("VARIABLE_DELETE", (client,db,variable,key,value,type, timestamp) => VarDelete(client,client.db, variable,key,value,type, timestamp));

  }
    
    onApplicationCmdCreate() {

    client.on("applicationCommandCreate", (application) => AppCmdCreate(application,client));

  }
    onApplicationCmdUpdate(){
        client.on("applicationCommandUpdate",(oldData,newData) => {
            
            AppCmdUpdate(oldData,newData,client)
            
        })
                  }
    onApplicationCmdDelete(){

        client.on("applicationCommandDelete", (client,application) => {

            

            AppCmdDelete(client, application)

            

        })

                  }
    

  variables(op = {}) {
    Object.assign(client.variables, op);
  }
}

String.prototype.deleteBrackets = function () {
  return this.replace(/\[/g, "#RIGHT#")
    .replace(/\]/g, "#LEFT#")
    .replace(/;/g, "#SEMI#")
    .replace(/:/g, "#COLON#")
    .replace(/\$/g, "#CHAR#")
    .replace(/>/g, "#RIGHT_CLICK#")
    .replace(/</g, "#LEFT_CLICK#")
    .replace(/=/g, "#EQUAL#")
    .replace(/{/g, "#RIGHT_BRACKET#")
    .replace(/}/g, "#LEFT_BRACKET#");
};

String.prototype.removeBrackets = String.prototype.deleteBrackets;

String.prototype.check = function () {
  return this.trim().replace(/\t/g, "").split(/ +/g)[0][0];
};

String.prototype.after = function () {
  const afterIndex = this.indexOf("[");
  const after = this.replace(/(\s|\n)/gim, "").startsWith("[")
    ? this.split("[").slice(1).join("[")
    : undefined;

  let inside;

  let total = "";

  let splits = [];

  if (after) {
    const before = this.substring(0, afterIndex);

    const rightIndexes = searchIndexes("[", after);
    const leftIndexes = searchIndexes("]", after);

    //no ] found
    if (leftIndexes.length === 0) {
      inside = after;
      total = `${before}[${inside}`;
    } else if (rightIndexes.length === 0) {
      inside = after.substring(0, leftIndexes[0]);
      total = `${before}[${inside}]`;
    } else {
      const merged = [];

      let leftIndex = 0;

      //merge
      for (let i = 0; i < rightIndexes.length; ++i) {
        const right = rightIndexes[i];

        let left = leftIndexes[leftIndex];

        while (left < right && typeof left === "number") {
          merged.push({
            index: left,
            isLeft: true,
          });

          left = leftIndexes[++leftIndex];
        }

        merged.push({
          index: right,
          isLeft: false,
        });

        if (typeof left !== "number") break;
      }

      while (leftIndex < leftIndexes.length) {
        const left = leftIndexes[leftIndex++];

        merged.push({
          index: left,
          isLeft: true,
        });
      }

      let index = 0;
      let depth = 1;

      for (let i = 0; i < merged.length; ++i) {
        const obj = merged[i];

        index = obj.index;

        if (obj.isLeft) --depth;
        else ++depth;

        if (!depth) break;
      }

      if (depth) index = after.length;

      inside = after.substring(0, index);
      total = `${before}[${inside}${depth ? "" : "]"}`;
    }

    splits = inside.split(";");
  }

  return {
    inside,
    total,
    splits,
    toString() {
      return total;
    },
    addBrackets() {
      return inside ? inside.addBrackets() : "";
    },
  };
};

String.prototype.addBrackets = function () {
  return this.replace(/#RIGHT#/g, "[")
    .replace(/#LEFT#/g, "]")
    .replace(/#SEMI#/g, ";")
    .replace(/#COLON#/g, ":")
    .replace(/#CHAR#/g, "$")
    .replace(/#RIGHT_CLICK#/g, ">")
    .replace(/#LEFT_CLICK#/g, "<")
    .replace(/#EQUAL#/g, "=")
    .replace(/#RIGHT_BRACKET#/g, "{")
    .replace(/#LEFT_BRACKET#/g, "}");
};

Array.prototype.goof = function (sep = "_") {
  return this.map((x) =>
    x
      .split(sep)
      .map((w) =>
        w.toLowerCase().replace(w[0].toLowerCase(), w[0].toUpperCase())
      )
      .join(" ")
  ).join(", ");
};

String.prototype.replaceLast = function (find, replace) {
  var index = this.lastIndexOf(find);

  if (index >= 0) {
    return (
      this.substring(0, index) + replace + this.substring(index + find.length)
    );
  }

  return this.toString();
};

module.exports = Client;
