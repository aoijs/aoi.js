/*
    Copyright (c) 2021 Andrew Trims and Contributors

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import { Base64String, Guild, TextChannel, VoiceChannel } from "discord.js";
import EventEmitter from "events";

type LavalinkSource = "youtube" | "soundcloud";
export type version = string;

export interface WSOptions {
    reconnectDelay: number,
    reconnectMaxAttempts: number,
    shardCount: number,
    password: string,
    userID: number,
    url: "example.com",
    resumeKey: string,
    timeout: number,
}

export enum PlayerStates {
    IDLE = "player_idle",
    PLAYING = "player_playing",
    PAUSED = "player_pause",
    TRACK_CHANGE = "player_tr_change",
    DESTROYED = "player_died",
    STOPPED = "player_forced_stop"
}

interface LavalinkPlayerEvents {
    stateChange: [oldState: PlayerStates, newState: PlayerStates];
}

interface LavalinkManagerEvents {
    trackPlaying: [Player: LavalinkPlayer];
    trackFinished: [Player: LavalinkPlayer];
}

export interface JoinVoiceChannelOptions {
  guildId: `${bigint}`;
  channelId: `${bigint}`;
  selfDeaf: boolean;
  selfMute: boolean;
  send: (data: LavalinkPacketVoiceState) => boolean;
}

export interface LavalinkPacketVoiceState {
  op: string;
  sessionId: string;
  guildId: `${bigint}`;
  channelId: `${bigint}`;
  event: string;
}

export interface RawTrack {
  track: Base64String;
  info: {
    identifier: string;
    isSeekable: true;
    author: string;
    length: number;
    isStream: false;
    position: number;
    title: string;
    uri: "https://www.youtube.com/watch?v={video_id}";
    sourceName: LavalinkSource;
  }
}

export interface Track {
  id: string;
  publisher: string;
  duration: string;
  isStream: false;
  thumbnail: string;
  title: string;
  url: "https://www.youtube.com/watch?v={video_id}";
  encoded: Base64String;
  requesterId: `${bigint}`;
}

export enum LavalinkIncomingMessageType {
  playerUpdate = "playerUpdate",
  status = "stats",
  event = "event"
}

export enum LavalinkEvents {
  TrackStartEvent = "TrackStartEvent",
  TrackEndEvent = "TrackEndEvent",
  TrackExceptionEvent = "TrackExceptionEvent",
  TrackStuckEvent = "TrackStuckEvent"
}

export interface LavalinkStatusMessage {
  playingPlayers: number;       
  memory: {
    reservable: number;
    used: number;     
    free: number;
    allocated: number; 
  },
  players: number;
  cpu: {
    cores: number;
    systemLoad: number;
    lavalinkLoad: number;
  };
  uptime: number;
}

export interface LavalinkIncomingMesssage {
    type: LavalinkEvents;
    guildId: `${bigint}`;
    code: number;
    reason: string;
    byRemote: boolean;
    state: {
      time: number;
      position: number;
      connected: boolean;
    };
    op: LavalinkIncomingMessageType;
}

export interface LavalinkPlayerState {
  time: number;
  position: number;
  connected: boolean;
}

export class LavalinkPlayer extends EventEmitter {
    constructor(LavalinkURL: "example.com", AuthorizationPassword: string, Manager: LavalinkConnection);
    public state: PlayerStates;
    public manager: LavalinkConnection;
    public text: TextChannel;
    public voiceState: LavalinkPacketVoiceState;
    public queue: Track[];
    public timeState: string;
    public loopSong: boolean;
    public loopQueue: boolean;
    public volume: number;

    public destroy(): void;
    public stop(): void;
    public next(): void;
    public seek(ms: number): void;
    public pause(doPause: boolean): void;
    public push(...tracks: Track[]): void;
    public isPlaying(): boolean;
    public isPaused(): boolean;
    public isIdling(): boolean;
    public getTimestate(left_seconds: boolean): string;

    public on<K extends keyof LavalinkPlayerEvents>(event: K, listener: (...args: LavalinkPlayerEvents[K]) => void): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof LavalinkPlayerEvents>,
      listener: (...args: any[]) => void,
    ): this;

    public once<K extends keyof LavalinkPlayerEvents>(event: K, listener: (...args: LavalinkPlayerEvents[K]) => void): this;
    public once<S extends string | symbol>(
      event: Exclude<S, keyof LavalinkPlayerEvents>,
      listener: (...args: any[]) => void,
    ): this;

    public emit<K extends keyof LavalinkPlayerEvents>(event: K, ...args: LavalinkPlayerEvents[K]): boolean;
    public emit<S extends string | symbol>(event: Exclude<S, keyof LavalinkPlayerEvents>, ...args: any[]): boolean;

    public off<K extends keyof LavalinkPlayerEvents>(event: K, listener: (...args: LavalinkPlayerEvents[K]) => void): this;
    public off<S extends string | symbol>(
      event: Exclude<S, keyof LavalinkPlayerEvents>,
      listener: (...args: any[]) => void,
    ): this;

    public removeAllListeners<K extends keyof LavalinkPlayerEvents>(event?: K): this;
    public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof LavalinkPlayerEvents>): this;
}

export class LavalinkConnection extends EventEmitter {
  constructor(LavalinkURL: "example.com", LavalinkAuthorizationPassword: string, UserId: `${bigint}`, ShardAmount: number, WebsocketOptions: WSOptions);
  public createAudioPlayer(guild: Guild): LavalinkPlayer;
  public trackVoiceStateUpdates(): Function;
  public search(searchQuery: string): Promise<Track>;
  public listenDebug(): void;
  public joinVoiceChannel(guild: Guild, channel: VoiceChannel): void;
  public leaveVoiceChannel(guild: Guild): void;

  public on<K extends keyof LavalinkManagerEvents>(event: K, listener: (...args: LavalinkManagerEvents[K]) => void): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof LavalinkManagerEvents>,
      listener: (...args: any[]) => void,
    ): this;

    public once<K extends keyof LavalinkManagerEvents>(event: K, listener: (...args: LavalinkManagerEvents[K]) => void): this;
    public once<S extends string | symbol>(
      event: Exclude<S, keyof LavalinkManagerEvents>,
      listener: (...args: any[]) => void,
    ): this;

    public emit<K extends keyof LavalinkManagerEvents>(event: K, ...args: LavalinkManagerEvents[K]): boolean;
    public emit<S extends string | symbol>(event: Exclude<S, keyof LavalinkManagerEvents>, ...args: any[]): boolean;

    public off<K extends keyof LavalinkManagerEvents>(event: K, listener: (...args: LavalinkManagerEvents[K]) => void): this;
    public off<S extends string | symbol>(
      event: Exclude<S, keyof LavalinkManagerEvents>,
      listener: (...args: any[]) => void,
    ): this;

    public removeAllListeners<K extends keyof LavalinkManagerEvents>(event?: K): this;
    public removeAllListeners<S extends string | symbol>(event?: Exclude<S, keyof LavalinkManagerEvents>): this;
}
