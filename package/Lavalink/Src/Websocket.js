const WebSocket = require("ws");
const { EventEmitter } = require("events");
const ServerManager = require("./ServerManager");
class LavalinkWebsocket extends EventEmitter {
  /**
   *
   * @param {ServerManager} ServerManager
   * @param {!Object} options
   */
  constructor(
    ServerManager,
    options = {
      reconnectDelay: 3000,
      reconnectMaxAttempts: 5,
      shardCount: 1,
      password: "",
      userID: 123,
      url: "example.com",
      resumeKey: "npm i dbd.js",
      timeout: 60,
    }
  ) {
    super();
    this.options = options;
    this.reconnectDelay = options.reconnectDelay || 3000;
    this.reconnectMaxAttempts = options.reconnectMaxAttempts || 5;
    this.connect(this.options);
    this._queue = [];
    this.isManualClosed = false;
    this.mgr = ServerManager;
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
    const headers = {
      "Client-Name":
        options.userAgent || "dbd.js; https://www.npmjs.com/package/dbd.js",
      "Num-Shards": options.shardCount || 1,
      Authorization: options.password,
      "User-Id": options.userID,
    };
    if (this.resumeKey) headers["Resume-Key"] = this.resumeKey;
    this._debug("Connecting", options);
    this.ws = new WebSocket("ws://" + options.url, { headers });
    this.triedReconnecting += 1;
    this.ws.once("open", () => this._open(options));
    this.ws.once("upgrade", (...args) => this._upgrade(options, ...args));
    this.ws.once("close", (...args) => this._close(options, ...args));
    this.ws.once("error", (...args) => this._error(options, ...args));
    this.ws.on("message", (...args) => this._message(options, ...args));
  }

  _debug(task, options, message) {
    if (task) {
      this.emit(
        "debug",
        `[Lavalink Websocket]: TASK ${task}(${options.url}) EXECUTED ${
          message ? "WITH MESSAGE " + message : ""
        }`
      );
    } else {
      this.emit("debug", `[Lavalink Websocket]: ${message}`);
    }
  }

  _open(options) {
    this._debug("Connected", options);
    this.emit("open");
    this.triedReconnecting = 0;
    for (const Packet of this._queue) {
      this._send(Packet);
    }
    this._queue = [];
    this.configureResuming(this.options.timeout);
  }

  configureResuming(timeout = 60, key = "npm i dbd.js") {
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
    this.emit("send", resolve, reject, data);
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
    this.emit("close", ...args);
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
    this.emit("message", packet);
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
    if (packet.guildId && this.mgr.servers.has(packet.guildId)) {
      this.mgr.handleMessage(packet)
    }
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
      this.emit("reconnect");
      try {
        this.connect(this.options);
      } catch (error) {
        this._debug(null, this.options, "ERROR: " + error.message);
        this._reconnect();
      }
    });
  }

  _error(options, ...args) {
    this.emit("error", ...args);
    this._debug("Error", options);
    this._close(options, ...args);
  }

  _upgrade(options, ...args) {
    this.emit("upgrade", ...args);
    this._debug("Upgrade", options);
  }
}

module.exports = LavalinkWebsocket;
