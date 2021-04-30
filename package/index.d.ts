declare module "dbd.js" {
  import { Client } from "discord.js";
  import { EventEmitter } from "events";

  class CustomEvent {
    constructor(client: Client, emitter: EventEmitter);

    client: Client;
    event: EventEmitter;
    commands: Interfaces.Command[];

    listen(name: string): void;
    command(command: Interfaces.Command): void;
  }

  export namespace Interfaces {
    interface Options {
      token: string;
      prefix: string[] | string;
      mobile?: boolean;
      database?: object;
      dbhToken?: boolean;
      sharding?: boolean;
      autoUpdate?: boolean;
      shardAmount?: number;
      fetchInvites?: boolean;
      youtubeCookie?: string;
      typingStopEvent?: boolean;
      disabledFunctions?: string[];
      disabledFunctionsStarting?: string[];
      boosterToken?:string;
    }

    interface Path {
      path: string;
      debug: boolean;
    }

    interface Command {
      code: string;
      channel: string;
    }

    interface Slash {
      name: string;
      code: string;
    }

    interface Normal {
      name: string;
      code: string;
      nonPrefixed?: boolean;
      aliases?: string | string[];
    }

    interface Loop {
      code: string;
      every: number;
      channel: string;
      executeOnStartup?: boolean;
    }

    interface Message {
      guildOnly: boolean;
      respondToBots: boolean;
    }

    interface Status {
      type: string;
      text: string;
      time: number;
      url?: string;
    }
  }

  export class Bot {
    constructor(options: Interfaces.Options);

    client: Client;
    paths: Interfaces.Path[];

    variables(variables: object): void;
    status(status: Interfaces.Status): void;
    createCustomEvent(emitter: EventEmitter): CustomEvent;
    loadCommands(path: string, debug?: boolean): Promise<void>;
    createLavalink(url: string, password: string, debug?: boolean): void;

    onLeave(): void;
    onJoined(): void;
    onBanAdd(): void;
    onBanRemove(): void;
    onGuildJoin(): void;
    onRateLimit(): void;
    onRoleCreate(): void;
    onRoleUpdate(): void;
    onRoleDelete(): void;
    onGuildLeave(): void;
    onReactionAdd(): void;
    onTypingStart(): void;
    onInviteCreate(): void;
    onInviteDelete(): void;
    onMemberUpdate(): void;
    onChannelCreate(): void;
    onChannelUpdate(): void;
    onChannelDelete(): void;
    onMessageUpdate(): void;
    onMessageDelete(): void;
    onReactionRemove(): void;
    onPresenceUpdate(): void;
    onVoiceStateUpdate(): void;
    onInteractionCreate(): void;

    onMessage(options: Interfaces.Message): void;

    command(command: Interfaces.Normal): void;
    loopCommand(command: Interfaces.Loop): void;
    interactionCommand(command: Interfaces.Slash): void;

    joinCommand(command: Interfaces.Command): void;
    leaveCommand(command: Interfaces.Command): void;
    readyCommand(command: Interfaces.Command): void;
    updateCommand(command: Interfaces.Command): void;
    banAddCommand(command: Interfaces.Command): void;
    deletedCommand(command: Interfaces.Command): void;
    timeoutCommand(command: Interfaces.Command): void;
    botJoinCommand(command: Interfaces.Command): void;
    botLeaveCommand(command: Interfaces.Command): void;
    musicEndCommand(command: Interfaces.Command): void;
    rateLimitCommand(command: Interfaces.Command): void;
    banRemoveCommand(command: Interfaces.Command): void;
    userUpdateCommand(command: Interfaces.Command): void;
    roleCreateCommand(command: Interfaces.Command): void;
    roleDeleteCommand(command: Interfaces.Command): void;
    roleUpdateCommand(command: Interfaces.Command): void;
    musicStartCommand(command: Interfaces.Command): void;
    reactionAddCommand(command: Interfaces.Command): void;
    typingStartCommand(command: Interfaces.Command): void;
    inviteDeleteComamnd(command: Interfaces.Command): void;
    timeoutPulseCommand(command: Interfaces.Command): void;
    inviteCreateCommand(command: Interfaces.Command): void;
    memberUpdateCommand(command: Interfaces.Command): void;
    channelUpdateCommand(command: Interfaces.Command): void;
    channelDeleteCommand(command: Interfaces.Command): void;
    channelCreateCommand(command: Interfaces.Command): void;
    reactionRemoveCommand(command: Interfaces.Command): void;
    presenceUpdateCommand(command: Interfaces.Command): void;
    voiceStateUpdateCommand(command: Interfaces.Command): void;
  }
}
