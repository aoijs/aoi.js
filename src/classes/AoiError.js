const Util = require("./Util.js");
const {
    ComponentParser,
    EmbedParser,
    FileParser,
} = Util.parsers;
const {Time} = require("../utils/helpers/customParser.js");
const {BaseInteraction} = require("discord.js");

class AoiError {
    constructor() {
        const error = new Error(`Cannot initialize "AoiError" Class`);
        error.name = "AoiError";
        throw error;
    }

    /**
     * @param  {string} event
     * @param  {string} intent
     * @param  {number} line
     * @returns {Error}
     */
    static EventError(event, intent, line) {
        const error = new Error(
            `(Missing Intents) : "${event}" requires "${intent}" intent.`,
        );
        error.name = "EventError";
        error.fileName = "./AoiClient.js";
        error.lineNumber = line;
        throw error;
    }

    /**
     * @param  {string} command
     * @param  {string} type
     * @param  {string} name
     * @param  {number} position
     * @returns {Error}
     */
    static CommandError(command, type, name, position) {
        if (type === "name") {
            const error = new Error(
                `AoiError: "Name" property is missing in "${command}" (position: ${position})`,
            );
            error.name = "CommandNameError";
            throw error;
        } else if (type === "code") {
            const error = new Error(
                `AoiError: "Code" is not provided in "${
                    name || "the Command"
                }" : ${command} (position: ${position})`,
            );
            error.name = "CommandCodeError";
            throw error;
        } else if (type === "channel") {
            const error = new Error(
                `AoiError: "Channel" is not provided in "${
                    name || "the Command"
                }" : ${command} (position: ${position})`,
            );
            error.name = "CommandChannelError";
            throw error;
        }
    }

    /**
     * @param  {import('./AoiClient.js')} client
     * @param  {import('discord.js').TextChannel |
     * import('discord.js').ThreadChannel |
     * import('discord.js').NewsChannel |
     * import('discord.js').User |
     * import('discord.js').Webhook | import('discord.js').Interaction } channel
     * @param  {object} options={}
     * @param  {object} extraOptions={}
     * @param  {object} d
     * @returns {Promise<import('discord.js').Message>}
     */
    static async makeMessageError(
        client,
        channel,
        options = {},
        extraOptions = {},
        d,
    ) {
        options = options.data ?? options;
        if (typeof options === "object") {
            options.content = options.content?.toString()?.trim() || " ";
            if (options.embeds && typeof options.embeds === "string") {
                options.embeds = await EmbedParser(options.embeds);
            }
            if (options.files && typeof options.files === "string") {
                options.files = FileParser(options.files);
            }
            if (options.components && typeof options.components === "string") {
                options.components = await ComponentParser(
                    options.components,
                    client,
                );
            }
        } else {
            options = {
                content:
                    options?.toString()?.trim() === ""
                        ? " "
                        : options?.toString(),
            };
        }
        let msg;
        if (extraOptions.interaction) {
            if (
                options.content === "" &&
                options.embeds?.length === 0 &&
                options.files?.length === 0
            )
                return;
            msg = await d.data.interaction.reply(options);
        } else {
            if (channel instanceof BaseInteraction) {
                if (
                    options.content === "" &&
                    options.embeds?.length === 0 &&
                    options.files?.length === 0
                )
                    return;
                msg = await channel.reply(options).catch((e) => {
                    this.consoleError("CreateMessageError", e);
                    return undefined;
                });
            } else {
                if (
                    options.content === " " &&
                    (options.embeds?.length ?? 0) === 0 &&
                    (options.files?.length ?? 0) === 0 &&
                    (options.stickers?.length ?? 0) === 0
                )
                    return;
                msg = await channel.send(options).catch((e) => {
                    this.consoleError("CreateMessageError", e);
                    return undefined;
                });
            }
        }

        if (extraOptions.reactions?.length) {
            extraOptions.reactions.forEach((x) => msg.react(x));
        }
        if (extraOptions.edits) {
            const editIn = setInterval(async () => {
                if (!extraOptions.edits.messages?.length) clearInterval(editIn);
                else {
                    const obj = extraOptions.edits.messages.shift();

                    msg.edit(obj);
                }
            }, Time.parse(extraOptions.edits.time)?.ms);
        }
        if (extraOptions.deleteIn) {
            extraOptions.deleteIn = Time.parse(extraOptions.deleteIn)?.ms;
            setTimeout(() => msg.delete(), extraOptions.deleteIn);
        }
        if (extraOptions.deleteCommand) {
            d.message.delete();
        }
        return msg;
    }

    /**
     * @param  {string} name
     * @param  {any} e
     * @returns {void}
     */
    static consoleError(name, e) {
        return console.error(`${name}: ${e}`);
    }

    /**
     * @param  {object} d
     * @param  {"member" | "message" | "channel" | "user" | "role" | 'guild' | "emoji" | "option" | "custom" } type
     * @param  {object} data
     * @param  {string | void} message
     * @returns {string}
     */
    static functionErrorResolve(d, type, data, message) {
        let errorData = {
            Function: `\`${d.command.codeLines}\``,
            Command: `\`${d.command.name}\``,
            Version: require("../../package.json").version,
        };

        switch (type) {
            case "member":
                errorData.type = "Member ID";
                break;
            case "message":
                errorData.type = "Message ID";
                break;
            case "channel":
                errorData.type = "Channel ID";
                break;
            case "user":
                errorData.type = "User ID";
                break;
            case "role":
                errorData.type = "Role ID";
                break;
            case "guild":
                errorData.type = "Guild ID";
                break;
            case "emoji":
                errorData.type = "Emoji ID";
                break;
            case "option":
                errorData.type = "Option ID";
                break;
            case "custom":
                errorData.type = message;
                break;
        }
        return `\`\`\`js\nAoiError: Invalid ${errorData.type} Provided In ${data.inside || ""} \n { \n   Function : ${errorData.Function},\n   Command : ${errorData.Command},\n   Version : ${errorData.Version} \n }\`\`\``;
    }

    /**
     * @param {object} d - The data object.
     * @param {"member" | "message" | "channel" | "user" | "role" | "guild" | "emoji" | "option" | "custom"} type - The type of error.
     * @param {object} data - The additional error data.
     * @param {string} [message] - An optional custom error message.
     * @returns {void}
     */
    static fnError(d, type, data, message) {
        d.error(this.functionErrorResolve(d, type, data, message));
    }
}

module.exports = AoiError;
