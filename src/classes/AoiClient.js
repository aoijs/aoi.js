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
    /**
     * @param {import("../index").ClientOptions} options AoiClient constructor options.
     */
    constructor(options) {
        super(options);
        this.functionManager = new FunctionManager(this);
        if (this.aoiOptions.respondOnEdit) {
            this.aoiOptions.respondOnEdit.time =
                this.aoiOptions.respondOnEdit.time ?? 60000;
        }
    }

    /**
     * Add a command to the AoiClient.
     * @param  {import("../index").Command[]} args 
     */
    command(...args) {
        for (const d of args) {
            if (!d.name) throw new TypeError(`Command ${this.cmd.default.size} needs a name!`);
            if (!d.code) throw new TypeError(`Command ${this.cmd.default.size} needs a code!`);
            if (!("type" in d)) d.type = "default";
            if (!this.cmd.types.includes(d.type)) throw new TypeError(`Invalid command type in ${this.cmd.default.size}!`);
            this.cmd[d.type].set(this.cmd[d.type].size, new Command(d, this));
        }
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    guildJoinCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: guildJoinCommand. position: ${this.cmd.guildJoin.size}`,
            );
        }

        this.cmd.guildJoin.set(this.cmd.guildJoin.size, new Command(d, this));
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    guildLeaveCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: guildLeaveCommand. position: ${this.cmd.guildLeave.size}`,
            );
        }

        this.cmd.guildLeave.set(this.cmd.guildLeave.size, new Command(d, this));
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    guildUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: guildUpdateCommand. position: ${this.cmd.guildUpdate.size}`,
            );
        }

        this.cmd.guildUpdate.set(this.cmd.guildUpdate.size, new Command(d, this));
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    roleCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: roleCreateCommand. position: ${this.cmd.roleCreate.size}`,
            );
        }
        this.cmd.roleCreate.set(this.cmd.roleCreate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    roleUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: roleUpdateCommand. position: ${this.cmd.roleUpdate.size}`,
            );
        }
        this.cmd.roleUpdate.set(this.cmd.roleUpdate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    roleDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: roleDeleteCommand. position: ${this.cmd.roleDelete.size}`,
            );
        }
        this.cmd.roleDelete.set(this.cmd.roleDelete.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    channelCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: channelCreateCommand. position: ${this.cmd.channelCreate.size}`,
            );
        }
        this.cmd.channelCreate.set(this.cmd.channelCreate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    channelUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: channelUpdateCommand. position: ${this.cmd.channelUpdate.size}`,
            );
        }
        this.cmd.channelUpdate.set(this.cmd.channelUpdate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    channelDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: channelDeleteCommand. position: ${this.cmd.channelDelete.size}`,
            );
        }
        this.cmd.channelDelete.set(this.cmd.channelDelete.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    threadCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: threadCreateCommand. position: ${this.cmd.threadCreate.size}`,
            );
        }
        this.cmd.threadCreate.set(this.cmd.threadCreate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    threadUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: threadUpdateCommand. position: ${this.cmd.threadUpdate.size}`,
            );
        }
        this.cmd.threadUpdate.set(this.cmd.threadUpdate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    threadDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: threadDeleteCommand. position: ${this.cmd.threadDelete.size}`,
            );
        }
        this.cmd.threadDelete.set(this.cmd.threadDelete.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    threadListSyncCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: threadListSyncCommand. position: ${this.cmd.threadListSync.size}`,
            );
        }
        this.cmd.threadListSync.set(this.cmd.threadListSync.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    joinCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: joinCommand. position: ${this.cmd.join.size}`,
            );
        }
        this.cmd.join.set(this.cmd.join.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    leaveCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: leaveCommand. position: ${this.cmd.leave.size}`,
            );
        }
        this.cmd.leave.set(this.cmd.leave.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    threadMembersUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: membersUpdateCommand. position: ${this.cmd.membersUpdate.size}`,
            );
        }
        this.cmd.membersUpdate.set(this.cmd.membersUpdate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    memberAvailableCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: memberAvailableCommand. position: ${this.cmd.memberAvailable.size}`,
            );
        }
        this.cmd.memberAvailable.set(this.cmd.memberAvailable.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    membersChunkCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: membersChunkCommand. position: ${this.cmd.membersChunk.size}`,
            );
        }
        this.cmd.membersChunk.set(this.cmd.membersChunk.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    emojiCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: emojiCreateCommand. position: ${this.cmd.emojiCreate.size}`,
            );
        }
        this.cmd.emojiCreate.set(this.cmd.emojiCreate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    emojiDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: emojiDeleteCommand. position: ${this.cmd.emojiDelete.size}`,
            );
        }
        this.cmd.emojiDelete.set(this.cmd.emojiDelete.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    emojiUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: emojiUpdateCommand. position: ${this.cmd.emojiUpdate.size}`,
            );
        }
        this.cmd.emojiUpdate.set(this.cmd.emojiUpdate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    banAddCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: banAddCommand. position: ${this.cmd.banAdd.size}`,
            );
        }
        this.cmd.banAdd.set(this.cmd.banAdd.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    banRemoveCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: banRemoveCommand. position: ${this.cmd.banRemove.size}`,
            );
        }
        this.cmd.banRemove.set(this.cmd.banRemove.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    reactionAddCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: reactionAddCommand. position: ${this.cmd.reactionAdd.size}`,
            );
        }
        this.cmd.reactionAdd.set(this.cmd.reactionAdd.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    reactionRemoveCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: reactionRemoveCommand. position: ${this.cmd.reactionRemove.size}`,
            );
        }
        this.cmd.reactionRemove.set(this.cmd.reactionRemove.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    presenceUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: presenceUpdateCommand. position: ${this.cmd.presenceUpdate.size}`,
            );
        }
        this.cmd.presenceUpdate.set(this.cmd.presenceUpdate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
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

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    applicationCmdUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: ApplicationCmdUpdateCommand. position: ${this.cmd.applicationCmdUpdate.size
                }`,
            );
        }
        this.cmd.applicationCmdUpdate?.set(
            this.cmd.applicationCmdUpdate.size,
            d,
        );
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    applicationCmdPermissionsUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: ApplicationCmdPermissionsUpdateCommand. position: ${this.cmd.applicationCmdPermissionsUpdate.size
                }`,
            );
        }
        this.cmd.applicationCmdPermissionsUpdate?.set(
            this.cmd.applicationCmdPermissionsUpdate.size,
            d,
        );
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    userUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: userUpdateCommand. position: ${this.cmd.userUpdate.size}`,
            );
        }
        this.cmd.userUpdate?.set(this.cmd.userUpdate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    variableCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: variableCreateCommand. position: ${this.cmd.variableCreate.size}`,
            );
        }
        this.cmd.variableCreate?.set(this.cmd.variableCreate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    variableDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: variableDeleteCommand. position: ${this.cmd.variableDelete.size}`,
            );
        }
        this.cmd.variableDelete?.set(this.cmd.variableDelete.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    variableUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: variableUpdateCommand. position: ${this.cmd.variableUpdate.size}`,
            );
        }
        this.cmd.variableUpdate?.set(this.cmd.variableUpdate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    readyCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: readyCommand. position: ${this.cmd.ready.size}`,
            );
        }
        this.cmd.ready?.set(this.cmd.ready.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    functionErrorCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: functionErrorCommand. position: ${this.cmd.functionError.size}`,
            );
        }
        this.cmd.functionError?.set(this.cmd.functionError.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    loopCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: loopCommand. position: ${this.cmd.loop.size}`,
            );
        }
        this.cmd.loop?.set(this.cmd.loop.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    timeoutCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: timeoutCommand. position: ${this.cmd.timeout.size}`,
            );
        }
        this.cmd.timeout?.set(this.cmd.timeout.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    pulseCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: pulseCommand. position: ${this.cmd.pulse.size}`,
            );
        }
        this.cmd.pulse?.set(this.cmd.pulse.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    rateLimitCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: rateLimitCommand. position: ${this.cmd.rateLimit.size}`,
            );
        }
        this.cmd.rateLimit?.set(this.cmd.rateLimit.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    webhookUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: webhookUpdateCommand. position: ${this.cmd.webhookUpdate.size}`,
            );
        }
        this.cmd.webhookUpdate?.set(this.cmd.webhookUpdate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    autoModActionExecutionCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: autoModActionExecutionCommand. position: ${this.cmd.autoModActionExecution.size}`,
            );
        }
        this.cmd.autoModActionExecution?.set(this.cmd.autoModActionExecution.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    autoModCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: autoModCreateCommand. position: ${this.cmd.autoModCreate.size}`,
            );
        }
        this.cmd.autoModCreate?.set(this.cmd.autoModCreate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    autoModDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: autoModDeleteCommand. position: ${this.cmd.autoModDelete.size}`,
            );
        }
        this.cmd.autoModDelete?.set(this.cmd.autoModDelete.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    autoModUpdateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: autoModUpdateCommand. position: ${this.cmd.autoModUpdate.size}`,
            );
        }
        this.cmd.autoModUpdate?.set(this.cmd.autoModUpdate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    inviteCreateCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: inviteCreateCommand. position: ${this.cmd.inviteCreate.size}`,
            );
        }
        this.cmd.inviteCreate?.set(this.cmd.inviteCreate.size, d);
    }

    /**
     * @deprecated
     * Use AoiClient#command instead.
     */
    inviteDeleteCommand(d = {}) {
        if (!d.code) {
            throw new TypeError(
                `Code is not provided in ${d?.name || "unknown name"
                }: inviteDeleteCommand. position: ${this.cmd.inviteDelete.size}`,
            );
        }
        this.cmd.inviteDelete?.set(this.cmd.inviteDelete.size, d);
    }
}

require("../utils/helpers/prototypes.js");
module.exports = Client;