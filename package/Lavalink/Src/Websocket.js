/*
  Copyright (c) 2021 Andrew Trims and Contributors

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const WebSocket = require("ws");
class LavalinkWebsocket {
  /**
   *
   * @param {import("./LavalinkConnection")} ServerManager
   * @param {import("../index").WSOptions} options
   */
  constructor(
    ServerManager,
    options
  ) {
    options.resumeKey = options.resumeKey || "TGF2YVdyYXA=@1-b";
    if (isNaN(options.timeout)) options.timeout = 60;
    if (isNaN(options.shardCount)) options.shardCount = 1;

    this.options = options;
    this.reconnectDelay = options.reconnectDelay || 3000;
    this.reconnectMaxAttempts = options.reconnectMaxAttempts || 5;
    this.mgr = ServerManager;
    this._queue = [];
    this.isManualClosed = false;
    this.connect(this.options);

  }

  close(code, data) {
    this.isManualClosed = true;
    if (this.ws && this.ws.readyState === WebSocket.OPEN)
      this.ws.close(code, data);
    this._close(this.options, ...args);
  }

  connect(options) {
    if (options) options = Object.assign(options, this.options);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.close();
    const useSecure = (options.useSafeProtocol === true) || false;
    let protocol = "ws://";
    if (useSecure) protocol = "wss://"
    const headers = {
      "Client-Name":
        options.userAgent || "NodeJS; https://nodejs.org/en/",
      "Num-Shards": options.shardCount || 1,
      Authorization: options.password,
      "User-Id": options.userID,
    };
    if (this.resumeKey) headers["Resume-Key"] = this.resumeKey;
    this._debug("Connecting", options);
    this.ws = new WebSocket(protocol + options.url, { headers });
    this.triedReconnecting += 1;
    this.ws.once("open", () => this._open(options));
    this.ws.once("upgrade", (...args) => this._upgrade(options, ...args));
    this.ws.once("close", (...args) => this._close(options, ...args));
    this.ws.on("error", (...args) => this._error(options, ...args));
    this.ws.on("message", (...args) => this._message(options, ...args));
  }

  _debug(task, options, message) {
    if (task) {
      this.mgr.emit(
        "debug",
        `[Lavalink Websocket]: TASK ${task}(${options.url}) EXECUTED ${
          message ? "WITH MESSAGE " + message : ""
        }`
      );
    } else {
      this.mgr.emit("debug", `[Lavalink Websocket]: ${message}`);
    }
  }

  _open(options) {
    this._debug("Connected", options);
    this.mgr.emit("open");
    this.triedReconnecting = 0;
    for (const Packet of this._queue) {
      this._send(Packet);
    }
    this._queue = [];
    this.configureResuming(this.options.timeout);
  }

  configureResuming(timeout = 60, key = "TGF2YVdyYXA=@1-b") {
    this.resumeKey = key;
    return this.send({
      userAgent: "Lavalink",
      op: "configureResuming",
      key,
      timeout,
    });
  }

  send(d) {

    return new Promise((resolve, reject) => {
      const serialized = JSON.stringify(d);
      const packet = { resolve, reject, data: serialized };
      if (this.ws.readyState === WebSocket.OPEN) {
        this._send(packet);
      } else {
        this._queue.push(packet);
      }
    });
  }

  _send({ resolve, reject, data }) {
    this._debug("Sending Packet", this.options);
    this.mgr.emit("send", resolve, reject, data);
    this.ws.send(data, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  }

  _close(options, ...args) {
    this._debug("Closed", options);
    this.mgr.emit("close", ...args);
    this.ws.removeAllListeners();
    this._reconnect();
  }

  _message(options, d) {
    if (Array.isArray(d)) d = Buffer.concat(d);
    else if (d instanceof ArrayBuffer) d = Buffer.from(d);
    let packet;
    try {
      packet = JSON.parse(d);
    } catch (err) {
      packet = d;
    }
    this.mgr.emit("message", packet);
    this._debug(
      "Received Message [ " +
        (packet.op === "event"
          ? packet.reason
            ? packet.type + ":" + packet.reason
            : packet.type
          : packet.op) +
        " ] ",
      options
    );

    if (packet) this.mgr.handleMessage(packet);
  }

  _reconnect() {
    if (
      this.ws.readyState !== WebSocket.CLOSED ||
      this.triedReconnecting > this.reconnectMaxAttempts
    )
      return;
    if (this.isManualClosed) return;
    new Promise((resolve) => {
      setTimeout(resolve, this.reconnectDelay);
    }).then(async () => {
      this.mgr.emit("reconnect");
      try {
        this.connect(this.options);
      } catch (error) {
        this._debug(null, this.options, "ERROR: " + error.message);
        this._reconnect();
      }
    });
  }

  _error(options, ...args) {
    this.mgr.emit("error", ...args)
    this._debug("Error", options);
    this._close(options, ...args);
  }

  _upgrade(options, ...args) {
    this.mgr.emit("upgrade", ...args);
    this._debug("Upgrade", options);
  }
}

module.exports = LavalinkWebsocket;
