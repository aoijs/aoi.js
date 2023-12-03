const Util = require("./Util.js");
const chalk = require("chalk");
const { ComponentParser, EmbedParser, FileParser, OptionParser } = Util.parsers.parsers;
const { Time } = require("../utils/helpers/customParser.js");
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
     * @param  {object} message={}
     * @param  {object} options={}
     * @param  {object} d
     * @returns {Promise<import('discord.js').Message>}
     */
    static async makeMessageError(
        client,
        channel,
        message = {},
        options = {},
        d,
    ) {
        message = message.data ?? message;

        const Checker = (theparts, name) => theparts.includes("{"+name+":");
        
        if (typeof message === "object") {
            message.content = message.content || " ";
            if (message.embeds && typeof message.embeds === "string") {
                message.embeds = await EmbedParser.code(d, { part: message.embeds, Checker });
            }
            if (message && typeof message.files === "string") {
                message.files = FileParser.code(d, { part: message.files, Checker });
            }
            if (message.components && typeof message.components === "string") {
                message.components = await ComponentParser.code(d, { part: message.files, Checker });
            }
        } else {
            message = {
                content:
                    message?.toLowerCase()?.trim() === ""
                        ? " "
                        : message?.toString(),
            };
        }
        if (options && typeof options === "string") {
            options = await OptionParser.code(d, { part: options, Checker })
        }
        
        let msg;
        
        if (options.interaction) {
            if (
                message.content === "" &&
                message.embeds?.length === 0 &&
                message.files?.length === 0
            )
                return;
            msg = await d.data.interaction.reply(message);
        } else {
            if (channel instanceof BaseInteraction) {
                if (
                    message.content === "" &&
                    message.embeds?.length === 0 &&
                    message.files?.length === 0
                )
                    return;
                msg = await channel.reply(message).catch((err) => {
                    AoiError.consoleError("CreateMessageError", err);
                    return undefined;
                });
            } else {
                if (
                    message.content === " " &&
                    (message.embeds?.length ?? 0) === 0 &&
                    (messages.files?.length ?? 0) === 0 &&
                    (message.stickers?.length ?? 0) === 0
                )
                    return;
                msg = await channel.send(message).catch((err) => {
                    AoiError.consoleError("CreateMessageError", err);
                    return undefined;
                });
            }
        }

        if (options.reactions?.length) {
            options.reactions.forEach((x) => msg?.react(x).catch(e => {}));
        }
        if (options.edits) {
            const editIn = setInterval(async () => {
                if (!options.edits.messages?.length) clearInterval(editIn);
                else {
                    const obj = options.edits.messages.shift();

                    msg?.edit(obj);
                }
            }, Time.parse(options.edits.time)?.ms);
        }
        if (options.deleteIn) {
            options.deleteIn = Time.parse(options.deleteIn)?.ms;
            setTimeout(() => msg?.delete(), options.deleteIn);
        }
        if (options.deleteCommand) {
            d.message?.delete().catch(e => {});
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
            Function: `\`${d.func}\``,
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
        return `\`\`\`js\nAoiError: Invalid ${errorData.type} ${data.inside || ""} \n { \n   Function : ${errorData.Function},\n   Command : ${errorData.Command},\n   Version : ${errorData.Version} \n }\`\`\``;
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
   * @param {Array<{text: string, textColor?: string}> | {text: string, textColor?: string}} messages - The messages to be displayed in the box.
   * @param {string} [borderColor="yellow"] - The color of the box border. Default is "yellow".
   * @param {{text: string, textColor?: string}} [title] - The title of the box.
   * @returns {void}
   */
  static createCustomBoxedMessage(messages, borderColor = "yellow", title) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }

    const maxLength = title
      ? Math.max(...messages.map((msg) => msg.text.length), title.text.length)
      : Math.max(...messages.map((msg) => msg.text.length));

    const topBorder = chalk[borderColor](`╭${"─".repeat(maxLength + 2)}╮`);
    const bottomBorder = chalk[borderColor](`╰${"─".repeat(maxLength + 2)}╯`);

    console.log(topBorder);

    if (title) {
      const titlePadding = " ".repeat((maxLength - title.text.length) / 2);
      const titleText = `${chalk[borderColor]("│")} ${titlePadding}${chalk[
        title.textColor
      ](title.text)}${titlePadding} ${chalk[borderColor]("│")}`;
      console.log(titleText);
    }

    messages.forEach((message) => {
      const paddingLength = (maxLength - message.text.length) / 2;
      const leftPadding = " ".repeat(Math.floor(paddingLength));
      const rightPadding = " ".repeat(Math.ceil(paddingLength));
      const textColor = message.textColor || "reset";
      const messageText = `${chalk[borderColor]("│")} ${leftPadding}${chalk[
        textColor
      ](message.text)}${rightPadding} ${chalk[borderColor]("│")}`;
      console.log(messagconst Util = require("./Util.js");
const { ComponentParser, EmbedParser, FileParser, OptionParser } = Util.parsers.parsers;
const { Time } = require("../utils/helpers/customParser.js");
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
     * @param  {object} message={}
     * @param  {object} options={}
     * @param  {object} d
     * @returns {Promise<import('discord.js').Message>}
     */
    static async makeMessageError(
        client,
        channel,
        message = {},
        options = {},
        d,
    ) {
        message = message.data ?? message;

        const Checker = (theparts, name) => theparts.includes("{"+name+":");
        
        if (typeof message === "object") {
            message.content = message.content || " ";
            if (message.embeds && typeof message.embeds === "string") {
                message.embeds = await EmbedParser.code(d, { part: message.embeds, Checker });
            }
            if (message && typeof message.files === "string") {
                message.files = FileParser.code(d, { part: message.files, Checker });
            }
            if (message.components && typeof message.components === "string") {
                message.components = await ComponentParser.code(d, { part: message.files, Checker });
            }
        } else {
            message = {
                content:
                    message?.toLowerCase()?.trim() === ""
                        ? " "
                        : message?.toString(),
            };
        }
        if (options && typeof options === "string") {
            options = await OptionParser.code(d, { part: options, Checker })
        }
        
        let msg;
        
        if (options.interaction) {
            if (
                message.content === "" &&
                message.embeds?.length === 0 &&
                message.files?.length === 0
            )
                return;
            msg = await d.data.interaction.reply(message);
        } else {
            if (channel instanceof BaseInteraction) {
                if (
                    message.content === "" &&
                    message.embeds?.length === 0 &&
                    message.files?.length === 0
                )
                    return;
                msg = await channel.reply(message).catch((err) => {
                    AoiError.consoleError("CreateMessageError", err);
                    return undefined;
                });
            } else {
                if (
                    message.content === " " &&
                    (message.embeds?.length ?? 0) === 0 &&
                    (messages.files?.length ?? 0) === 0 &&
                    (message.stickers?.length ?? 0) === 0
                )
                    return;
                msg = await channel.send(message).catch((err) => {
                    AoiError.consoleError("CreateMessageError", err);
                    return undefined;
                });
            }
        }

        if (options.reactions?.length) {
            options.reactions.forEach((x) => msg?.react(x).catch(e => {}));
        }
        if (options.edits) {
            const editIn = setInterval(async () => {
                if (!options.edits.messages?.length) clearInterval(editIn);
                else {
                    const obj = options.edits.messages.shift();

                    msg?.edit(obj);
                }
            }, Time.parse(options.edits.time)?.ms);
        }
        if (options.deleteIn) {
            options.deleteIn = Time.parse(options.deleteIn)?.ms;
            setTimeout(() => msg?.delete(), options.deleteIn);
        }
        if (options.deleteCommand) {
            d.message?.delete().catch(e => {});
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
            Function: `\`${d.func}\``,
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
        return `\`\`\`js\nAoiError: Invalid ${errorData.type} ${data.inside || ""} \n { \n   Function : ${errorData.Function},\n   Command : ${errorData.Command},\n   Version : ${errorData.Version} \n }\`\`\``;
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
   * @param {Array<{text: string, textColor?: string}> | {text: string, textColor?: string}} messages - The messages to be displayed in the box.
   * @param {string} [borderColor="yellow"] - The color of the box border. Default is "yellow".
   * @param {{text: string, textColor?: string}} [title] - The title of the box.
   * @returns {void}
   */
  static createCustomBoxedMessage(messages, borderColor = "yellow", title) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }

    const maxLength = title
      ? Math.max(...messages.map((msg) => msg.text.length), title.text.length)
      : Math.max(...messages.map((msg) => msg.text.length));

    const topBorder = chalk[borderColor](`╭${"─".repeat(maxLength + 2)}╮`);
    const bottomBorder = chalk[borderColor](`╰${"─".repeat(maxLength + 2)}╯`);

    console.log(topBorder);

    if (title) {
      const titlePadding = " ".repeat((maxLength - title.text.length) / 2);
      const titleText = `${chalk[borderColor]("│")} ${titlePadding}${chalk[
        title.textColor
      ](title.text)}${titlePadding} ${chalk[borderColor]("│")}`;
      console.log(titleText);
    }

    messages.forEach((message) => {
      const paddingLength = (maxLength - message.text.length) / 2;
      const leftPadding = " ".repeat(Math.floor(paddingLength));
      const rightPadding = " ".repeat(Math.ceil(paddingLength));
      const textColor = message.textColor || "reset";
      const messageText = `${chalk[borderColor]("│")} ${leftPadding}${chalk[
        textColor
      ](message.text)}${rightPadding} ${chalk[borderColor]("│")}`;
      console.log(messageText);
    });

    console.log(bottomBorder);
  }
}

module.exports = AoiError;
