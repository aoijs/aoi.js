require("./AoiError.js");
const BaseClient = require("./AoiBase.js");
const { Command } = require("./Commands.js");
const { FunctionManager } = require("./Functions.js");

const [major] = process.version.replace("v", "").split(".")
if (isNaN(Number(major)) || Number(major) < 16) {
    throw new Error(`node.js version must be v16.9.0 or above.`)
}

//Initialize aoi.js Client
class Client extends BaseClient {
    constructor(options) {
        super(options);
        this.functionManager = new FunctionManager(this);
        if (this.aoiOptions.respondOnEdit) {
            this.aoiOptions.respondOnEdit.time =
                this.aoiOptions.respondOnEdit.time ?? 60000;
        }
    }

    //Commands
    command(...args) {
        for (const d of args) {
            if (!d.name)
                throw new TypeError(`Command ${this.cmd.default.size} needs a name!`);
            if (!d.code)
                throw new TypeError(`Command ${this.cmd.default.size} needs a code!`);

            this.cmd.default.set(this.cmd.default.size, new Command(d, this));
        }
    }

    awaitedCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(`Code is not provided in ${d.name}`);
        }
        if (!d.name) {
            throw new Error(
                `Name is not provided to command at position ${this.cmd.awaited.size}`,
            );
        }

        this.cmd.awaited.set(this.cmd.awaited.size, new Command(d, this));
    }

    deletedCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: deletedCommand. position: ${this.cmd.messageDelete.size}`,
            );
        }
        this.cmd.messageDelete.set(
            this.cmd.messageDelete.size,
            new Command(d, this),
        );
    }

    updateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: updateCommand. position: ${this.cmd.messageUpdate.size}`,
            );
        }

        this.cmd.messageUpdate.set(
            this.cmd.messageUpdate.size,
            new Command(d, this),
        );
    }

    bulkDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: bulkDeletedCommand. position: ${this.cmd.messageDeleteBulk.size}`,
            );
        }

        this.cmd.messageDeleteBulk.set(
            this.cmd.messageDeleteBulk.size,
            new Command(d, this),
        );
    }

    //-------------------//
    guildJoinCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: guildJoinCommand. position: ${this.cmd.guildJoin.size}`,
            );
        }

        this.cmd.guildJoin.set(this.cmd.guildJoin.size, new Command(d, this));
    }

    guildLeaveCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: guildLeaveCommand. position: ${this.cmd.guildLeave.size}`,
            );
        }

        this.cmd.guildLeave.set(this.cmd.guildLeave.size, new Command(d, this));
    }

    guildUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: guildUpdateCommand. position: ${this.cmd.guildUpdate.size}`,
            );
        }

        this.cmd.guildUpdate.set(this.cmd.guildUpdate.size, new Command(d, this));
    }

    guildUnavailableCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: guildUnavailableCommand. position: ${this.cmd.guildUnavailable.size
                }`,
            );
        }
        this.cmd.guildUnavailable.set(
            this.cmd.guildUnavailable.size,
            new Command(d, this),
        );
    }

    roleCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: roleCreateCommand. position: ${this.cmd.roleCreate.size}`,
            );
        }
        this.cmd.roleCreate.set(this.cmd.roleCreate.size, d);
    }

    roleUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: roleUpdateCommand. position: ${this.cmd.roleUpdate.size}`,
            );
        }
        this.cmd.roleUpdate.set(this.cmd.roleUpdate.size, d);
    }

    roleDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: roleDeleteCommand. position: ${this.cmd.roleDelete.size}`,
            );
        }
        this.cmd.roleDelete.set(this.cmd.roleDelete.size, d);
    }

    channelCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: channelCreateCommand. position: ${this.cmd.channelCreate.size}`,
            );
        }
        this.cmd.channelCreate.set(this.cmd.channelCreate.size, d);
    }

    channelUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: channelUpdateCommand. position: ${this.cmd.channelUpdate.size}`,
            );
        }
        this.cmd.channelUpdate.set(this.cmd.channelUpdate.size, d);
    }

    channelDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: channelDeleteCommand. position: ${this.cmd.channelDelete.size}`,
            );
        }
        this.cmd.channelDelete.set(this.cmd.channelDelete.size, d);
    }

    channelPinsUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: channelPinsUpdateCommand. position: ${this.cmd.channelPinsUpdate.size
                }`,
            );
        }
        this.cmd.channelPinsUpdate.set(this.cmd.channelPinsUpdate.size, d);
    }

    stageInstanceCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: stageInstanceCreateCommand. position: ${this.cmd.stageInstanceCreate.size
                }`,
            );
        }
        this.cmd.stageInstanceCreate.set(this.cmd.stageInstanceCreate.size, d);
    }

    stageInstanceUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: stageInstanceUpdateCommand. position: ${this.cmd.stageInstanceUpdate.size
                }`,
            );
        }
        this.cmd.stageInstanceUpdate.set(this.cmd.stageInstanceUpdate.size, d);
    }

    stageInstanceDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: stageInstanceDeleteCommand. position: ${this.cmd.stageInstanceDelete.size
                }`,
            );
        }
        this.cmd.stageInstanceDelete.set(this.cmd.stageInstanceDelete.size, d);
    }

    threadCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: threadCreateCommand. position: ${this.cmd.threadCreate.size}`,
            );
        }
        this.cmd.threadCreate.set(this.cmd.threadCreate.size, d);
    }

    threadUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: threadUpdateCommand. position: ${this.cmd.threadUpdate.size}`,
            );
        }
        this.cmd.threadUpdate.set(this.cmd.threadUpdate.size, d);
    }

    threadDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: threadDeleteCommand. position: ${this.cmd.threadDelete.size}`,
            );
        }
        this.cmd.threadDelete.set(this.cmd.threadDelete.size, d);
    }

    threadListSyncCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: threadListSyncCommand. position: ${this.cmd.threadListSync.size}`,
            );
        }
        this.cmd.threadListSync.set(this.cmd.threadListSync.size, d);
    }

    threadMemberUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: threadMemberUpdateCommand. position: ${this.cmd.threadMemberUpdate.size
                }`,
            );
        }
        this.cmd.threadMemberUpdate.set(this.cmd.threadMemberUpdate.size, d);
    }

    //--------------------------------//
    joinCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: joinCommand. position: ${this.cmd.join.size}`,
            );
        }
        this.cmd.join.set(this.cmd.join.size, d);
    }

    leaveCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: leaveCommand. position: ${this.cmd.leave.size}`,
            );
        }
        this.cmd.leave.set(this.cmd.leave.size, d);
    }

    memberUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: MemberUpdateCommand. position: ${this.cmd.memberUpdate.size
                }`,
            );
        }
        this.cmd.memberUpdate.set(this.cmd.memberUpdate.size, d);
    }

    threadMembersUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: membersUpdateCommand. position: ${this.cmd.membersUpdate.size}`,
            );
        }
        this.cmd.membersUpdate.set(this.cmd.membersUpdate.size, d);
    }

    memberAvailableCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: memberAvailableCommand. position: ${this.cmd.memberAvailable.size}`,
            );
        }
        this.cmd.memberAvailable.set(this.cmd.memberAvailable.size, d);
    }

    membersChunkCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: membersChunkCommand. position: ${this.cmd.membersChunk.size}`,
            );
        }
        this.cmd.membersChunk.set(this.cmd.membersChunk.size, d);
    }

    //---------------------------------//
    emojiCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: emojiCreateCommand. position: ${this.cmd.emojiCreate.size}`,
            );
        }
        this.cmd.emojiCreate.set(this.cmd.emojiCreate.size, d);
    }

    emojiDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: emojiDeleteCommand. position: ${this.cmd.emojiDelete.size}`,
            );
        }
        this.cmd.emojiDelete.set(this.cmd.emojiDelete.size, d);
    }

    emojiUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: emojiUpdateCommand. position: ${this.cmd.emojiUpdate.size}`,
            );
        }
        this.cmd.emojiUpdate.set(this.cmd.emojiUpdate.size, d);
    }

    //--------------------------------//
    banAddCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: banAddCommand. position: ${this.cmd.banAdd.size}`,
            );
        }
        this.cmd.banAdd.set(this.cmd.banAdd.size, d);
    }

    banRemoveCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: banRemoveCommand. position: ${this.cmd.banRemove.size}`,
            );
        }
        this.cmd.banRemove.set(this.cmd.banRemove.size, d);
    }

    //---------------------------------//
    reactionAddCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: reactionAddCommand. position: ${this.cmd.reactionAdd.size}`,
            );
        }
        this.cmd.reactionAdd.set(this.cmd.reactionAdd.size, d);
    }

    reactionRemoveCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: reactionRemoveCommand. position: ${this.cmd.reactionRemove.size}`,
            );
        }
        this.cmd.reactionRemove.set(this.cmd.reactionRemove.size, d);
    }

    reactionRemoveAllCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: reactionRemoveAllCommand. position: ${this.cmd.reactionRemoveAll.size
                }`,
            );
        }
        this.cmd.reactionRemoveAll.set(this.cmd.reactionRemoveAll.size, d);
    }

    reactionRemoveEmojiCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: reactionRemoveEmojiCommand. position: ${this.cmd.reactionRemoveEmoji.size
                }`,
            );
        }
        this.cmd.reactionRemoveEmoji.set(this.cmd.reactionRemoveEmoji.size, d);
    }

    //---------------------------------//
    presenceUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: presenceUpdateCommand. position: ${this.cmd.presenceUpdate.size}`,
            );
        }
        this.cmd.presenceUpdate.set(this.cmd.presenceUpdate.size, d);
    }

    //---------------------------------//
    voiceStateUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: voiceStateUpdateCommand. position: ${this.cmd.voiceStateUpdate.size
                }`,
            );
        }
        this.cmd.voiceStateUpdate.set(this.cmd.voiceStateUpdate.size, d);
    }

    //---------------------------------//
    interactionCommand(d = {}) {
        if (!d.prototype) {
            throw new TypeError(
                `Prototype is not provided in ${d.name || "unknown name"
                }: interactionCommand.`,
            );
        }
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: interactionCommand. position: ${this.cmd.interaction[d.prototype]?.size
                }`,
            );
        }
        this.cmd.interaction[d.prototype]?.set(
            this.cmd.interaction[d.prototype].size,
            d,
        );
    }

    applicationCmdCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: ApplicationCmdCreateCommand. position: ${this.cmd.applicationCmdCreate.size
                }`,
            );
        }
        this.cmd.applicationCmdCreate?.set(this.cmd.applicationCmdCreate.size, d);
    }

    applicationCmdDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: ApplicationCmdDeleteCommand. position: ${this.cmd.applicationCmdDelete.size
                }`,
            );
        }
        this.cmd.applicationCmdDelete?.set(this.cmd.applicationCmdDelete.size, d);
    }

    applicationCmdUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: ApplicationCmdUpdateCommand. position: ${this.cmd.onApplicationCmdUpdate.size
                }`,
            );
        }
        this.cmd.onApplicationCmdUpdate?.set(
            this.cmd.onApplicationCmdUpdate.size,
            d,
        );
    }

    userUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: userUpdateCommand. position: ${this.cmd.userUpdate.size}`,
            );
        }
        this.cmd.userUpdate?.set(this.cmd.userUpdate.size, d);
    }

    variableCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: variableCreateCommand. position: ${this.cmd.variableCreate.size}`,
            );
        }
        this.cmd.variableCreate?.set(this.cmd.variableCreate.size, d);
    }

    variableDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: variableDeleteCommand. position: ${this.cmd.variableDelete.size}`,
            );
        }
        this.cmd.variableDelete?.set(this.cmd.variableDelete.size, d);
    }

    variableUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: variableUpdateCommand. position: ${this.cmd.variableUpdate.size}`,
            );
        }
        this.cmd.variableUpdate?.set(this.cmd.variableUpdate.size, d);
    }

    readyCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: readyCommand. position: ${this.cmd.ready.size}`,
            );
        }
        this.cmd.ready?.set(this.cmd.ready.size, d);
    }

    functionErrorCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: functionErrorCommand. position: ${this.cmd.functionError.size}`,
            );
        }
        this.cmd.functionError?.set(this.cmd.functionError.size, d);
    }

    loopCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: loopCommand. position: ${this.cmd.loop.size}`,
            );
        }
        this.cmd.loop?.set(this.cmd.loop.size, d);
    }

    timeoutCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: timeoutCommand. position: ${this.cmd.timeout.size}`,
            );
        }
        this.cmd.timeout?.set(this.cmd.timeout.size, d);
    }

    pulseCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: pulseCommand. position: ${this.cmd.pulse.size}`,
            );
        }
        this.cmd.pulse?.set(this.cmd.pulse.size, d);
    }

    rateLimitCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: rateLimitCommand. position: ${this.cmd.rateLimit.size}`,
            );
        }
        this.cmd.rateLimit?.set(this.cmd.rateLimit.size, d);
    }

    webhookUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: webhookUpdateCommand. position: ${this.cmd.webhookUpdate.size}`,
            );
        }
        this.cmd.webhookUpdate?.set(this.cmd.webhookUpdate.size, d);
    }
}

require("../utils/helpers/prototypes.js");
module.exports = Client;