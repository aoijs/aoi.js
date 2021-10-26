/*
    Copyright (c) 2021 Andrew Trims and Contributors

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const EventEmitter = require("events").EventEmitter;
const {PlayerStates} = require("./Util");

/**
 * @type {import(".").LavalinkPlayer}
 */
class LavalinkPlayer extends EventEmitter {
    /**
     * 
     * @param {"example.com"} LavalinkURL 
     * @param {string} AuthorizationPassword 
     * @param {import("./LavalinkConnection")} Manager
     */
    constructor(LavalinkURL, AuthorizationPassword, Manager) {
        super();

        this.apiInformation = [LavalinkURL, AuthorizationPassword];
        /** @type {import("./LavalinkConnection")} */
        this.manager = Manager;

        this._state = "player_idle";
        /** @type {import("./index").LavalinkPacketVoiceState} */
        this._voiceState = {};
        this.queue = [];
        this.timeState = 0;
        this.text = null;
        this.loopQueue = false;
        this.loopSong = false;
        this._ready = false;
        this.filters = {
            volume: 1.0
        };
        /** @type {import("./index").LavalinkPlayerState} */
        this.lavalinkPlayerStatus = {   }

        // Using state property to handle queue and events
        this.on("stateChange", (oldState, newState) => {
            if (newState === PlayerStates.TRACK_CHANGE) {
                this.play(this.queue[0]);
            } else if (
                newState === PlayerStates.PLAYING
            ) {
                this.manager.emit("trackPlaying", this);
                
            } else if (
                oldState === PlayerStates.PLAYING && newState === PlayerStates.IDLE
            ) {
                this.timeState = 0;

                if (this.loopSong) { this.next(); }
                else if (this.loopQueue) {
                    if (this.queue.length < 2) return; 
                    const shifted = this.queue.shift();
                    
                    // Move track to the back
                    this.queue.push(shifted);

                    this.next();
                } else {
                    this.queue.shift();

                    this.next();
                }

                if (this.queue.length < 1) {
                    this.manager.emit("trackFinished", this);
                }
            }
        });

        this.once("playerReady", () => {
            this.next();
        });
    }

    getTimestate(duration_left) {

        if (duration_left) return this.manager._resolveDuration(Math.abs(1000 * (this.queue[0] || {lengthSeconds: 0}).lengthSeconds - this.timeState));
        return this.manager._resolveDuration(Math.abs(this.timeState));
    }

    get state() {
        return this._state
    }

    set state(newState) {
        if (newState !== this.state) this.emit("stateChange", this.state, newState);
        this._state = newState;
    }

    get voiceState() {
        return this._voiceState;
    }

    set voiceState(newState) {
        this._voiceState = newState;

        if (newState.guildId && newState.sessionId) {
            this._ready = true;
            this.emit("playerReady", newState);
        }
    }

    /**
     * 
     * @param {import("./index").Track} track 
     */
    play(track) {
        const body = {
            op: "play",
            guildId: this.voiceState.guildId,
            noReplace: true,
            volume: this.volume,
            track: track.encoded
        }

        this.manager._ws.send(body);
    }

    next() {
        const nextTrack = this.queue[0];
        if (!nextTrack) return;

        if (this._ready) this.state = PlayerStates.TRACK_CHANGE;
    }

    pause(doPause = true) {
        if (!this.isPlaying()) return;

        this.manager._ws.send({
            op: "pause",
            guildId: this.voiceState.guildId,
            pause: doPause
        });

        if (doPause) this.state = PlayerStates.PAUSED
        else this.state = PlayerStates.PLAYING;
    }

    seek(ms) {
        if (!this.isPlaying()) return;
        
        this.manager._ws.send({
            op: "seek",
            guildId: this.voiceState.guildId,
            position: ms
        });
    }

    stop() {
        if (!this.isPlaying()) return;

        this.manager._ws.send({
            op: "stop",
            guildId: this.voiceState.guildId
        });
        
    }

    destroy() {
        this.queue = [];

        this.removeAllListeners("stateChange");
        this.manager._ws.send({
            op: "destroy",
            guildId: this.voiceState.guildId
        });

        this.manager._players.delete(this.voiceState.guildId);
    }
    /**
     * 
     * @param {import("./index").Track[]} tracks 
     */

    push(...tracks) {
        let playAfterPush = false;

        if (
            this.state === PlayerStates.IDLE &&
            !this.queue.length &&
            this._ready
        ) playAfterPush = true;

        this.queue.push(...tracks);
        if (playAfterPush) this.next();
    }

    isPlaying() {
        if (this.state === PlayerStates.PLAYING) return true;
        return false;
    }

    isPaused() {
        if (this.state === PlayerStates.PAUSED) return true;
        return false;
    }

    isIdling() {
        if (this.state === PlayerStates.IDLE) return true;
        return false;
    }

    isConnected() {
        if (this.lavalinkPlayerStatus.connected) return true;
        return false;
    }

    patchFilters() {
        this.manager._ws.send({
            op: "filters",
            guildId: this.voiceState.guildId,
            ...this.filters
        });
    };

}

module.exports = LavalinkPlayer;
