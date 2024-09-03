const Util = require("./Util.js");
const chalk = require("chalk");
const { ComponentParser, EmbedParser, FileParser } = Util.parsers;
const { Time } = require("../core/Time.js");
const { BaseInteraction } = require("discord.js");

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
        const error = new Error(`(Missing Intents) : "${event}" requires "${intent}" intent.`);
        error.name = "EventError";
        error.fileName = "./AoiClient.js";
        error.lineNumber = line;
        throw error;
    }

    static AstGeneratorError(message, options) {
        const error = new Error(`(GenerationError): ${message} `);
        error.name = "AstGeneratorError";
        error.options = options;
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
            const error = new Error(`AoiError: "Name" property is missing in "${command}" (position: ${position})`);
            error.name = "CommandNameError";
            throw error;
        } else if (type === "code") {
            const error = new Error(`AoiError: "Code" is not provided in "${name || "the Command"}" : ${command} (position: ${position})`);
            error.name = "CommandCodeError";
            throw error;
        } else if (type === "channel") {
            const error = new Error(`AoiError: "Channel" is not provided in "${name || "the Command"}" : ${command} (position: ${position})`);
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
    static async makeMessageError(client, channel, options = {}, extraOptions = {}, d) {
        options = options?.data ?? options;
        if (typeof options === "object") {
            options.content = options.content?.toString()?.trim() || " ";
            if (options.embeds && typeof options.embeds === "string") {
                options.embeds = await EmbedParser(options.embeds, d);
            }
            if (options.files && typeof options.files === "string") {
                options.files = FileParser(options.files, d);
            }
            if (options.components && typeof options.components === "string") {
                options.components = await ComponentParser(options.components, d);
            }
        } else {
            options = {
                content: options?.toString()?.trim() === "" ? " " : options?.toString()
            };
        }

        let msg;
        if (extraOptions.interaction) {
            if (options.content === "" && options.embeds?.length === 0 && options.files?.length === 0) return;
            if (extraOptions?.defer) {
                await d.data.interaction.deferReply({
                    ephemeral: extraOptions.ephemeral ?? options.ephemeral
                });

                msg = await d.data.interaction.followUp({
                    ...options,
                    ephemeral: extraOptions.ephemeral ?? options.ephemeral
                });
            } else {
                msg = await d.data.interaction.reply({
                    ...options,
                    ephemeral: extraOptions.ephemeral ?? options.ephemeral
                });
            }
        } else {
            if (channel instanceof BaseInteraction) {
                if (options.content === "" && options.embeds?.length === 0 && options.files?.length === 0) return;
                msg = await channel.reply(options).catch((e) => {
                    AoiError.consoleError("CreateMessageError", e);
                    return undefined;
                });
            } else {
                if (options.content === " " && (options.embeds?.length ?? 0) === 0 && (options.files?.length ?? 0) === 0 && (options.stickers?.length ?? 0) === 0) return;

                if (extraOptions.reply?.message) {
                    if (extraOptions.reply?.mention) options.allowedMentions.repliedUser = true;

                    msg = await (await d.util.getMessage(channel, extraOptions.reply?.message)).reply(options).catch((e) => {
                        AoiError.consoleError("CreateMessageError", e);
                        return undefined;
                    });
                } else {
                    msg = await channel.send(options).catch((e) => {
                        AoiError.consoleError("CreateMessageError", e);
                        return undefined;
                    });
                }
            }
        }

        if (extraOptions.reactions?.length) {
            extraOptions.reactions.forEach((x) => msg.react(x));
        }

        if (extraOptions.edits) {
            let i = 0;
            for (const msgs of extraOptions.edits.messages) {
                for (const msgObj of msgs) {
                    await new Promise((resolve) => setTimeout(resolve, extraOptions.edits.time));

                    await msg.edit(msgObj).catch(() => console.warn);
                    i++;
                }
            }
        }

        if (extraOptions.deleteIn) {
            setTimeout(() => msg.delete(), extraOptions.deleteIn);
        }
        if (extraOptions.deleteCommand) {
            d.message.delete();
        }

        return msg;
    }

    /**
     * @param  {string} name
     * @param err
     * @returns {void}
     */
    static consoleError(name, err) {
        return console.error(`${name}: ${err}`);
    }

    /**
     * @param  {object} d
     * @param  {"member" | "message" | "channel" | "user" | "role" | 'guild' | "emoji" | "option" | "custom" } type
     * @param  {object} data
     * @param  {string | void} message
     * @returns {string}
     */
    static functionErrorResolve(d, type, data, message) {
        let errorData;

        if (!d.command.name) {
            errorData = {
                Function: d.func,
                Type: d.command?.type,
                Version: require("../../package.json").version
            };
        } else {
            errorData = {
                Function: d.func,
                Command: d.command.name,
                Version: require("../../package.json").version
            };
        }

        switch (type) {
            case "member":
                errorData.type = "Invalid Member ID";
                break;
            case "message":
                errorData.type = "Invalid Message ID";
                break;
            case "channel":
                errorData.type = "Invalid Channel ID";
                break;
            case "user":
                errorData.type = "Invalid User ID";
                break;
            case "role":
                errorData.type = "Invalid Role ID";
                break;
            case "guild":
                errorData.type = "Invalid Guild ID";
                break;
            case "emoji":
                errorData.type = "Invalid Emoji ID";
                break;
            case "option":
                errorData.type = "Invalid Option ID";
                break;
            case "custom":
                errorData.type = message;
                break;
        }
        return `AoiError: \`${errorData.Function}\` in \`${data.inside}\` (${errorData.type})`;
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

    /**
     * Creates a custom boxed message with optional title and border color.
     * @param {Array<{text: string, textColor?: string, centered?: boolean}> | {text: string, textColor?: string, centered?: boolean}} messages - The messages to be displayed in the box.
     * @param {string} [borderColor="white"] - The color of the box border. Default is "white".
     * @param {{text: string, textColor?: string}} [title] - The title of the box.
     * @returns {void}
     */
    static createConsoleMessage(messages, borderColor = "white", title) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }

        const strip = (str) => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");

        title = title && title.text ? title : { text: "", textColor: "white" };

        const totalwidth = process.stdout?.columns || 80;
        const bordercolor = chalk[borderColor] || chalk.white;

        const maxwidth = Math.max(...messages.map((msg) => strip(typeof msg === "string" ? msg : msg.text).length), strip(title.text).length);

        const msgwidth = Math.min(maxwidth, totalwidth - 4);
        const bordertop = bordercolor(`╭${"─".repeat(msgwidth + 2)}╮`);

        const wrapText = (text, width) => {
            const words = text.split(" ");
            let lines = [];
            let current = words[0];

            for (let i = 1; i < words.length; i++) {
                if (strip(current).length + strip(words[i]).length + 1 <= width) {
                    current += " " + words[i];
                } else {
                    lines.push(current);
                    current = words[i];
                }
            }
            lines.push(current);

            return lines;
        };

        const newmessage = (msg) => {
            const text = typeof msg === "string" ? msg : msg.text;
            const textcolor = msg.textColor ? chalk[msg.textColor] : chalk.white;
            const wrapped = wrapText(text, msgwidth);
            const msgs = wrapped.map((line) => {
                const padding = msgwidth - strip(line).length;
                const padded = msg.centered !== false ? " ".repeat(Math.abs(Math.floor(padding / 2))) + line + " ".repeat(Math.abs(Math.ceil(padding / 2))) : line + " ".repeat(Math.abs(padding));
                return `│ ${textcolor(padded)} │`;
            });
            return msgs;
        };

        const titlemsg = title.text ? newmessage(title) : [];
        const msgs = messages.flatMap(newmessage);

        console.log(bordertop);

        titlemsg.forEach((line) => console.log(line));

        msgs.forEach((line) => console.log(line));

        console.log(bordercolor(`╰${"─".repeat(Math.abs(msgwidth) + 2)}╯`));
    }
}

module.exports = AoiError;
