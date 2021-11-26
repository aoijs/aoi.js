const Group = require("../cachehandler/index.js").setCache;
const AoiError = require("./AoiError.js");

class Blacklist {
    constructor(client) {
        this.client = client;
        this.globalUser = {blacklist: new Group(), errorMsg: null};
        this.server = {blacklist: new Group(), errorMsg: null};
        this.channel = {blacklist: new Group(), errorMsg: null};
        this.role = {blacklist: new Group(), errorMsg: null};
        this.user = {blacklist: new Group(), errorMsg: null};
        this.commands = [];
    }

    setBlacklist(type, errorMsg) {
        if (!this.types.includes(type))
            AoiError.consoleError("BlacklistTypeError", "Invalid Type Provided");
        this[type].errorMsg = errorMsg;
    }

    blacklistIds(type, ...ids) {
        if (!this.types.includes(type))
            AoiError.consoleError("BlacklistTypeError", "Invalid Type Provided");
        this[type].blacklist.squash(...ids);
    }

    whitelistIds(type, ...ids) {
        if (!this.types.includes(type))
            AoiError.consoleError("BlacklistTypeError", "Invalid Type Provided");
        ids.forEach((x) => {
            this[type].blacklist.delete(x);
        });
    }

    get types() {
        return ["globalUser", "server", "channel", "role", "user"];
    }

    getBlacklistTable(type = "all") {
        let table = [];
        if (type === "all") {
            for (const type of this.types) {
                table.push(`
|-----------------------------------------|
|++++++++++++++++${type}++++++++++++++++++|
|ID                  |
${this[type].blacklist.map((x) => `|${x}    |`).join("\n")}
|-----------------------------------------|`);
            }
            return table.join("");
        } else {
            if (!this.types.includes(type))
                AoiError.consoleError("BlacklistTypeError", "Invalid Type Provided");
            {
                table.push(`
|-----------------------------------------|
|++++++++++++++++${type}++++++++++++++++++|
|ID                  |
${this[type].blacklist.map((x) => `|${x}    |`).join("\n")}
|-----------------------------------------|
`);
            }
            return table.join("");
        }
    }
}

module.exports = Blacklist;
