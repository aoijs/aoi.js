const { CacheOptions } = require("../utils/Constants.js");
const { Options } = require("discord.js");
const Cachers = require("./structures/dist/index.js");
const AoiError = require("./AoiError.js");

class CacheManager {
  constructor(client) {
    client.cacheManager = this;
    Object.defineProperty(this, "client", { value: client });
    this.caches = {
    };
    this.cachers = Cachers;
  }

  get types() {
    return Object.keys(Cachers);
  }

  _validType(type) {
    return this.types.includes(type);
  }

  createCache(type, name, options) {
    if (!this._validType(type))
      return AoiError.consoleError(
        "CacheManagerError",
        "Wrong Cache Type Provided",
      );
        if(!this.caches[type]) this.caches[type] = {};
    this.caches[type][name] = new Cachers[type](options);
    return this.caches[type][name];
  }

  deleteCache(type, name) {
    if (!this._validType(type))
      return AoiError.consoleError(
        "CacheManagerError",
        "Wrong Cache Type Provided",
      );

    delete this.caches[type][name];
  }

  static _setDjsCacheManagers(cache) {
    let managers = {};
    for (const [key, value] of Object.entries(cache)) {
      managers[CacheOptions[key]] = value;
    }
    const factory = Options.cacheWithLimits(managers);
    console.log({factory})
    return factory
  }
}
module.exports = CacheManager;