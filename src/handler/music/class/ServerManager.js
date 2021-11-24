const v = require('@discordjs/voice')
const fs = require('fs')

const Track = require('./Track.js')
const Cacher = require('./Cacher.js')
const Search = require('./Search.js')
const FFmpeg = require('./FFmpeg.js')
const wait = (ms) => new Promise(res => res(), ms)
//const MusicPool = require('./MusicPool.js')
const {States, Events} = require('../../../utils/VoiceConstants.js')

class ServerManager {
    constructor(options = {}) {
        this.textChannel = options.textChannel
        this.connection = options.connection
        this.channel = options.channel
        this.voice = options.voice
        this.queue = []
        this.cacher = new Cacher()
        this.search = new Search()
        this.ffmpeg = new FFmpeg()
        // this.musicPool = new MusicPool()
        this.player = v.createAudioPlayer({debug: true})
        this.resource = v.createAudioResource
        this.singleTrack = null
        this._defaultOptions()
        this._defaultStates()
        this._configPlayer()
        this._configConnection()
    }

    //public methods
    async addTrack(track, type, member) {
        if (type === 0) {
            const urls = await this.search.Youtube.search(track)
            console.log(urls)
            for (const url of urls) {
                const yt = await this.search.Youtube.getData(url, this.voice.ytdl)
                const stream = await this.ffmpeg.transformStream(yt.stream)//yt.stream
                const resource = this.resource(stream, {inlineVolume: true})
                this.queue.push(new Track(yt.info, stream, resource, type, member))
                if (this.queue.length === 1) {
                    this._playTrack()
                }
                await wait(5000)
            }
        }
        if (type === 1) {
            const urls = await this.search.SoundCloud.search(track)
            for (const url of urls) {
                try {
                    const sc = await this.search.SoundCloud.getData(url, this.voice.scdl)
                    const stream =/*await this.ffmpeg.transformStream(sc.stream)*/sc.stream
                    const resource = this.resource(stream, {inlineVolume: true})
                    this.queue.push(new Track(sc.info, stream, resource, type, member))
                    if (this.queue.length === 1) {
                        this._playTrack()
                    }
                    //await wait(5000)
                } catch (e) {
                    console.error(e)
                    continue;
                }
            }
        }
        if (type === 2) {
            const trackStream = fs.createReadStream(process.cwd() + '/' + track)
            const stream = await this.ffmpeg.transformStream(trackStream)//trackStream
            const resource = this.resource(stream, {inlineVolume: true})
            this.queue.push(new Track(track, stream, resource, type, member))
            if (this.queue.length === 1) {
                return this._playTrack()
            }

        }
    }

    pause() {
        this.options.paused = true
        this.player.pause()
    }

    resume() {
        this.options.paused = false
        this.player.unpause()
    }

    skip() {
    }

    setFilters(...filters) {
        this.ffmpeg.seekTo = (this.queue[0].currentDuration / 1000).toFixed(0)
        this.ffmpeg.setFilters(...filters)
        if (this.queue[0].type === 2) {
            const raw = fs.createReadStream(process.cwd() + `/${this.queue[0].info.name}`)
            const stream = this.ffmpeg.transformStream(raw)
            const res = this.resource(stream, {inlineVolume: true})
            this.queue[0].stream = stream
            this.queue[0].resource = res
            this.player.play(res)
        }

    }

    //private methods 
    _playSingleTrack() {
        if (this.singleTrack.type === 0) {
            if (this.voice.cache.enabled) {
                const stream = fs.createReadStream(process.cwd() + `/music/${this.channel.guild.id}/${this.singleTrack.Id}.mp4`)
                const resource = this.resource(stream, {inlineVolume: true})
                this.player.play(resource)
            } else {
                const stream = this.search.Youtube.getStream(this.singleTrack.info.url)
                const resource = this.resource(stream, {inlineVolume: true})
                this.player.play(resource)
            }
        }
        if (this.singleTrack.type === 1) {
            const stream = this.search.SoundCloud.transcodeUrl(this.singleTrack.rawInfo.transcodings[0].url)
            const resource = this.resource(stream, {inlineVolume: true})
            this.player.play(resource)
        }
        if (this.singleTrack.type === 2) {
            const stream = fs.createReadStream(process.cwd() + `/${this.singleTrack.queue.name}`)
            const resource = this.resource(stream, {inlineVolume: true})
            this.player.play(resource)
        }
    }

    async _loopQueue() {
        const queue = this.queue.shift()
        if (queue.type === 0) {
            if (this.voice.cache.enabled) {
                const ytstream = fs.createReadStream(process.cwd() + `/music/${this.channel.guild.id}/${queue.info.Id}.mp4`)
                const stream = await this.ffmpeg.transformStream(ytstream)
                const resource = this.resource(stream, {inlineVolume: true})
                queue.stream = stream
                queue.resource = resource
                this.queue.push(queue)
            } else {
                const ytstream = this.search.Youtube.getStream(queue.info.url)
                const stream = await this.ffmpeg.transformStream(ytstream)
                const resource = this.resource(stream, {inlineVolume: true})
                queue.stream = stream
                queue.resource = resource
                this.queue.push(queue)
                this._playTrack()
            }
        }
        if (queue.type === 1) {
            const stream = await this.search.SoundCloud.transcodStream(queue.rawInfo.media.transcodings[0], this.voice.scdl)
            const resource = this.resource(stream, {inlineVolume: true})
            queue.stream = stream
            queue.resource = resource
            this.queue.push(queue)
            this._playTrack()
        }
        if (queue.type === 2) {
            const stream = fs.createReadStream(process.cwd() + `/${queue.info.name}`)
            const resource = this.resource(stream, {inlineVolume: true})
            queue.stream = stream
            queue.resource = resource

            this.queue.push(queue)
            this._playTrack()
        }

    }

    _playNextTrack() {
        this.queue.shift()
        this._playTrack()
    }

    async _playTrack() {
        this.player.play(this.queue[0].resource)
        try {
            await v.entersState(this.player, v.AudioPlayerStatus.Playing, 10000)
            this.voice.emit(Events.TRACK_START, this.queue[0], this)
        } catch (e) {
            console.error(e)
            // this._destroyPlayer()
        }
    }

    _destroyPlayer() {
        this.queue = []
        this._defaultOptions()
        this._defaultStates()
    }

    //{@Default_Methods}
    _defaultOptions() {
        this.options = {
            paused: false,
            loopQueue: false,
            loopSong: false,
            volume: 100,
            leaveAfter: {enabled: false, time: 60000},
            leaveWhenVcEmpty: false
        }
    }

    _defaultStates() {
        this.states = {
            queue: States.queue.IDLE,
            loop: States.loop.NONE,
            player: this.player.state.status
        }
    }

    _configPlayer() {
        this.player.on("stateChange", async (os, ns) => {
            console.log([os.status, ns.status]?.join("|"))
            if (os.status !== v.AudioPlayerStatus.Idle && ns.status === v.AudioPlayerStatus.Idle) {
                if (this.options.paused) return;
                else if (this.options.loopSong && this.singleTrack) {
                    this._playSingleTrack()
                } else if (this.options.loopQueue && this.queue.length) {
                    this._loopQueue()
                } else if (this.queue.length > 1) {
                    this._playNextTrack()
                } else {
                    //this._destroyPlayer()
                }
            }
        })
        this.player.on("error", async message => console.error(message))
        this.player.on("debug", console.log)
        this.connection.subscribe(this.player)
    }

    _configConnection() {
        this.connection.on('stateChange', async (_, newState) => {
            console.log([newState.status, newState.closeCode, newState.reason]?.join("\n"))

            if (newState.status === v.VoiceConnectionStatus.Disconnected) {
                if (newState.reason === v.VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {

                    /*
                        If the WebSocket closed with a 4014 code, this means that we should not manually attempt to reconnect,
                        but there is a chance the connection will recover itself if the reason of the disconnect was due to
                        switching voice channels. This is also the same code for the bot being kicked from the voice channel,
                        so we allow 5 seconds to figure out which scenario it is. If the bot has been kicked, we should destroy
                        the voice connection.
                    */
                    try {
                        await v.entersState(this.connection, v.VoiceConnectionStatus.Connecting, 5_000);
                        // Probably moved voice channel
                    } catch {
                        this.connection.destroy();
                        // Probably removed from voice channel
                    }
                } else if (this.connection.rejoinAttempts < 5) {
                    /*
                        The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
                    */
                    await wait((this.connection.rejoinAttempts + 1) * 5_000);
                    this.connection.rejoin();
                } else {
                    /*
                        The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
                    */
                    this.connection.destroy();
                }
            } else if (newState.status === v.VoiceConnectionStatus.Destroyed) {
                /*
                    Once destroyed, stop the subscription
                */
                this.stop();
            } else if (

                (newState.status === v.VoiceConnectionStatus.Connecting || newState.status === v.VoiceConnectionStatus.Signalling)
            ) {
                /*
                    In the Signalling or Connecting states, we set a 20 second time limit for the connection to become ready
                    before destroying the voice connection. This stops the voice connection permanently existing in one of these
                    states.
                */
                this.readyLock = true;
                try {
                    await v.entersState(this.connection, v.VoiceConnectionStatus.Ready, 20_000);
                } catch {
                    if (this.connection.state.status !== v.VoiceConnectionStatus.Destroyed) this.connection.destroy();
                } finally {
                    this.readyLock = false;
                }
            }
        });
    }

    stop() {

        this.queueLock = true;

        this.queue = [];

        this.player.stop(true);

    }
}

module.exports = ServerManager;