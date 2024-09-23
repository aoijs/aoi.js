const { Group } = require("@aoijs/aoi.structures");

class Command {
    constructor(data = {}, client) {
        this.__client__ = client;
        if (typeof data.code === "string") {
            this.code = data.code;
        } else {
            throw new TypeError(`Missing or invalid 'code' property in '${data.name}' command \n Path: '${data.__path__}'`);
        }
        Object.entries(data).forEach(([key, value]) => (this[key] = value));
        this.functions = this.serializeFunctions();
        this.codeLines = this.serializeCode();
    }

    serializeFunctions() {
        const availableFunctions = this.__client__.functionManager.functions;
        let code = this.code.replace(/\\]/g, "#LEFT#").split("\\[").join("#RIGHT#").replace("\\,", "#COMMA#");

        const usedFunctions = [];

        const functionTokens = code.split("$");
        for (const functionToken of functionTokens) {
            const matchingFunctions = availableFunctions.filter(func =>
                func.toLowerCase() === ("$" + functionToken.toLowerCase()).slice(0, func.length)
            );

            if (matchingFunctions.length) {
                if (matchingFunctions.length === 1) {
                    usedFunctions.push(matchingFunctions[0]);
                } else if (matchingFunctions.length > 1) {
                    usedFunctions.push(matchingFunctions.sort((a, b) => b.length - a.length)[0]);
                }
            }
        }

        return usedFunctions;
    }

    serializeCode() {
        return this.code?.split("\n");
    }

    toString() {
        return JSON.stringify(this);
    }

    toArray() {
        return Object.entries(this);
    }

    values() {
        return Object.values(this);
    }

    keys() {
        return Object.keys(this);
    }
}

class CommandManager {
    constructor(client, formCommand = true, customCmds = []) {
        client.cmd = this;
        this.client = client;
        this.isClientCommand = formCommand;
        this.types = [
            "default", "awaited", "messageDelete", "messageUpdate", "messageDeleteBulk", "guildJoin",
            "guildUpdate", "guildLeave", "guildUnavailable", "roleCreate", "roleUpdate", "roleDelete",
            "channelCreate", "channelUpdate", "channelDelete", "channelPinsUpdate", "stageInstanceCreate",
            "stageInstanceUpdate", "stageInstanceDelete", "stickerCreate", "stickerDelete", "stickerUpdate",
            "threadCreate", "threadDelete", "threadListSync", "threadMemberUpdate", "threadMembersUpdate",
            "threadUpdate", "join", "leave", "inviteCreate", "inviteDelete", "memberUpdate", "memberAvailable",
            "membersChunk", "emojiCreate", "emojiUpdate", "emojiDelete", "banAdd", "banRemove", "webhooksUpdate",
            "voiceStateUpdate", "presenceUpdate", "reactionAdd", "reactionRemove", "reactionRemoveEmoji",
            "reactionRemoveAll", "typingStart", "pollVoteAdd", "pollVoteRemove", "loop", "timeout", "ready", "variableCreate",
            "variableDelete", "variableUpdate", "functionError", "interaction", "applicationCmdCreate",
            "applicationCmdUpdate", "applicationCmdDelete", "applicationCmdPermissionsUpdate", "userUpdate",
            "rateLimit", "shardReady", "shardResume", "shardReconnecting", "shardDisconnect", "shardError",
            "autoModActionExecution", "autoModCreate", "autoModDelete", "autoModUpdate", "entitlementCreate", "entitlementDelete", "entitlementUpdate"
        ];

        if (formCommand) {
            this.formCommand();
        } else {
            this.customCmds = customCmds;
            this.formCustomCommand(customCmds);
        }
    }

    formCommand() {
        this.types.forEach(x => (this[x] = new Group()));
        this.interaction = {
            selectMenu: new Group(),
            button: new Group(),
            slash: new Group(),
            modal: new Group(),
        };
    }

    createCommand(data = {}) {
        data.type = data.type || "default";
        data.code = data.code?.replace(/\$comment\[.*?\]\]+/gs, "");

        if (data.type === "interaction") {
            this.interaction[data.prototype].set(this.interaction[data.prototype].size, new Command(data, this.client));
        } else {
            this[data.type].set(this[data.type].size, new Command(data, this.client));
        }
    }

    formCustomCommand(customCmds) {
        customCmds.forEach(x => {
            this[x] = new Group();
        });

        if (!customCmds.includes("default")) {
            this.default = new Group();
        }
    }
}

module.exports = {
    CommandManager,
    Command,
};
