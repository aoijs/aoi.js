const BaseClient = require("./AoiBase");
const {Command} = require("./Commands");
const {FunctionManager} = require("./Functions");

const [major] = process.version.replace("v", "").split(".");
if (isNaN(Number(major)) || Number(major) < 20) {
    throw new TypeError("node.js version 20 or higher is required to run aoi.js.");
}

// Initialize aoi.js Client
class Client extends BaseClient {
    constructor(options) {
        super(options);
        this.functionManager = new FunctionManager(this);
        if (this.aoiOptions.respondOnEdit) {
            this.aoiOptions.respondOnEdit.time =
                this.aoiOptions.respondOnEdit.time ?? 60000;
        }
    }

    // Commands
    command(...args) {
        for (const d of args) {
            if (!d.name)
                throw new TypeError(`Command ${this.cmd.default.size} needs a name!`);
            if (!d.code)
                throw new TypeError(`Command ${this.cmd.default.size} needs a code!`);

            this.cmd.default.set(this.cmd.default.size, new Command(d, this));
        }
    }

    interactionCommand(d = {}) {
        if (!d.prototype) {
            throw new TypeError(`Prototype is not provided in ${d.name || "unknown name"}: interactionCommand.`,);
        }
        if (!d.code) {
            throw new TypeError(`Code is not provided in ${d?.name || "unknown name"}: interactionCommand. position: ${this.cmd.interaction[d.prototype]?.size}`,);
        }
        this.cmd.interaction[d.prototype]?.set(this.cmd.interaction[d.prototype].size, d);
    }

    addCommandType(type, d = {}) {
        if (!d.code) {
            throw new TypeError(`Code is not provided in ${d?.name || "unknown name"}: ${type}. position: ${this.cmd[type].size}`);
        }

        this.cmd[type].set(this.cmd[type].size, new Command(d, this));
    }

    awaitedCommand(d = {}) {
        this.addCommandType("awaited", d);
    }

    deletedCommand(d = {}) {
        this.addCommandType("messageDelete", d);
    }

    updateCommand(d = {}) {
        this.addCommandType("messageUpdate", d);
    }

    bulkDeleteCommand(d = {}) {
        this.addCommandType("messageDeleteBulk", d);
    }

    guildJoinCommand(d = {}) {
        this.addCommandType("guildJoin", d);
    }

    guildLeaveCommand(d = {}) {
        this.addCommandType("guildLeave", d);
    }

    guildUpdateCommand(d = {}) {
        this.addCommandType("guildUpdate", d);
    }

    guildUnavailableCommand(d = {}) {
        this.addCommandType("guildUnavailable", d);
    }

    roleCreateCommand(d = {}) {
        this.addCommandType("roleCreate", d);
    }

    roleUpdateCommand(d = {}) {
        this.addCommandType("roleUpdate", d);
    }

    roleDeleteCommand(d = {}) {
        this.addCommandType("roleDelete", d);
    }

    channelCreateCommand(d = {}) {
        this.addCommandType("channelCreate", d);
    }

    channelUpdateCommand(d = {}) {
        this.addCommandType("channelUpdate", d);
    }

    channelDeleteCommand(d = {}) {
        this.addCommandType("channelDelete", d);
    }

    channelPinsUpdateCommand(d = {}) {
        this.addCommandType("channelPinsUpdate", d);
    }

    stageInstanceCreateCommand(d = {}) {
        this.addCommandType("stageInstanceCreate", d);
    }

    stageInstanceUpdateCommand(d = {}) {
        this.addCommandType("stageInstanceUpdate", d);
    }

    stageInstanceDeleteCommand(d = {}) {
        this.addCommandType("stageInstanceDelete", d);
    }

    threadCreateCommand(d = {}) {
        this.addCommandType("threadCreate", d);
    }

    threadUpdateCommand(d = {}) {
        this.addCommandType("threadUpdate", d);
    }

    threadDeleteCommand(d = {}) {
        this.addCommandType("threadDelete", d);
    }

    threadListSyncCommand(d = {}) {
        this.addCommandType("threadListSync", d);
    }

    threadMemberUpdateCommand(d = {}) {
        this.addCommandType("threadMemberUpdate", d);
    }

    joinCommand(d = {}) {
        this.addCommandType("join", d);
    }

    leaveCommand(d = {}) {
        this.addCommandType("leave", d);
    }

    memberUpdateCommand(d = {}) {
        this.addCommandType("memberUpdate", d);
    }

    threadMembersUpdateCommand(d = {}) {
        this.addCommandType("threadMembersUpdate", d);
    }

    memberAvailableCommand(d = {}) {
        this.addCommandType("memberAvailable", d);
    }

    membersChunkCommand(d = {}) {
        this.addCommandType("membersChunk", d);
    }

    emojiCreateCommand(d = {}) {
        this.addCommandType("emojiCreate", d);
    }

    emojiDeleteCommand(d = {}) {
        this.addCommandType("emojiDelete", d);
    }

    emojiUpdateCommand(d = {}) {
        this.addCommandType("emojiUpdate", d);
    }

    banAddCommand(d = {}) {
        this.addCommandType("banAdd", d);
    }

    banRemoveCommand(d = {}) {
        this.addCommandType("banRemove", d);
    }

    reactionAddCommand(d = {}) {
        this.addCommandType("reactionAdd", d);
    }

    reactionRemoveCommand(d = {}) {
        this.addCommandType("reactionRemove", d);
    }

    reactionRemoveAllCommand(d = {}) {
        this.addCommandType("reactionRemoveAll", d);
    }

    reactionRemoveEmojiCommand(d = {}) {
        this.addCommandType("reactionRemoveEmoji", d);
    }

    presenceUpdateCommand(d = {}) {
        this.addCommandType("presenceUpdate", d);
    }

    voiceStateUpdateCommand(d = {}) {
        this.addCommandType("voiceStateUpdate", d);
    }

    pollVoteAddCommand(d = {}) {
        this.addCommandType("pollVoteAdd", d);
    }

    pollVoteRemoveCommand(d = {}) {
        this.addCommandType("pollVoteRemove", d);
    }

    entitlementCreateCommand(d = {}) {
        this.addCommandType("entitlementCreate", d);
    }
    
    entitlementUpdateCommand(d = {}) {
        this.addCommandType("entitlementUpdate", d);
    }

    entitlementDeleteCommand(d = {}) {
        this.addCommandType("entitlementDelete", d);
    }

    applicationCmdCreateCommand(d = {}) {
        this.addCommandType("applicationCmdCreate", d);
    }

    applicationCmdDeleteCommand(d = {}) {
        this.addCommandType("applicationCmdDelete", d);
    }

    applicationCmdUpdateCommand(d = {}) {
        this.addCommandType("applicationCmdUpdate", d);
    }

    applicationCmdPermissionsUpdateCommand(d = {}) {
        this.addCommandType("applicationCmdPermissionsUpdate", d);
    }

    userUpdateCommand(d = {}) {
        this.addCommandType("userUpdate", d);
    }

    variableCreateCommand(d = {}) {
        this.addCommandType("variableCreate", d);
    }

    variableDeleteCommand(d = {}) {
        this.addCommandType("variableDelete", d);
    }

    variableUpdateCommand(d = {}) {
        this.addCommandType("variableUpdate", d);
    }

    readyCommand(d = {}) {
        this.addCommandType("ready", d);
    }

    functionErrorCommand(d = {}) {
        this.addCommandType("functionError", d);
    }

    loopCommand(d = {}) {
        this.addCommandType("loop", d);
    }

    timeoutCommand(d = {}) {
        this.addCommandType("timeout", d);
    }

    rateLimitCommand(d = {}) {
        this.addCommandType("rateLimit", d);
    }

    webhooksUpdateCommand(d = {}) {
        this.addCommandType("webhooksUpdate", d);
    }

    autoModActionExecutionCommand(d = {}) {
        this.addCommandType("autoModActionExecution", d);
    }

    autoModCreateCommand(d = {}) {
        this.addCommandType("autoModCreate", d);
    }

    autoModDeleteCommand(d = {}) {
        this.addCommandType("autoModDelete", d);
    }

    autoModUpdateCommand(d = {}) {
        this.addCommandType("autoModUpdate", d);
    }

    inviteCreateCommand(d = {}) {
        this.addCommandType("inviteCreate", d);
    }

    inviteDeleteCommand(d = {}) {
        this.addCommandType("inviteDelete", d);
    }
}

require("../core/prototypes.js");
module.exports = Client;