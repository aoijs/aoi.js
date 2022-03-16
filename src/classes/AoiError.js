const {
  ComponentParser,
  EmbedParser,
  FileParser,
} = require("../handler/parsers.js");
const Util = require("./Util.js");
const { Time } = require("../utils/helpers/customParser.js");
const { Interaction } = require("discord.js");

class AoiError {
  constructor() {
    const error = new Error(`Cannot initialize "AoiError" Class`);
    error.name = "AoiError";
    throw error;
  }

  /**
   * @param  {string} callback
   * @param  {string} intent
   * @param  {number} line
   * @returns {Error}
   */
  static CallbackError(callback, intent, line) {
    const error = new Error(
      `(Missing Intents) : "${callback}" requires "${intent}" intent.`,
    );
    error.name = "CallbackError";
    error.fileName = "./Bot.js";
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
   * @param  {import('./Bot.js')} client
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
    if (typeof options === "object") {
      options.content = options.content?.toString()?.trim() || " ";
      if (options.embeds && typeof options.embeds === "string") {
        options.embeds = await EmbedParser(options.embeds);
      }
      if (options.files && typeof options.files === "string") {
        options.files = FileParser(options.files);
      }
      if (options.components && typeof options.components === "string") {
        options.components = await ComponentParser(options.components, client);
      }
    } else {
      options = {
        content: options?.toString()?.trim() === "" ? " " : options?.toString(),
      };
    }
    //console.log({options})
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
      if (channel instanceof Interaction) {
        if (
          options.content === "" &&
          options.embeds?.length === 0 &&
          options.files?.length === 0
        )
          return;
        msg = await channel.reply(options);
      } else {
        if (
          options.content === " " &&
          (options.embeds?.length ?? 0) === 0 &&
          (options.files?.length ??0) === 0 &&
          (options.stickers?.length ?? 0) === 0
        )
          return;
        msg = await channel.send(options);
      }
    }

    if (extraOptions.reactions?.length) {
      extraOptions.reactions.forEach((x) => msg.react(x));
    }
    if (extraOptions.edits) {
      const editIn = setInterval(async () => {
        if (!extraOptions.edits.messages?.length) clearInterval(editIn);
        else {
          const obj = await Util.errorParser(
            JSON.stringify(extraOptions.edits.messages.shift()),
            d,
          );

          msg.edit(obj);
        }
      }, Time.parse(extraOptions.edits.time)?.ms);
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
   * @param  {any} e
   * @returns {void}
   */
  static consoleError(name, e) {
    return console.error(`${name}: ${e}`);
  }

  /**
   * @param  {object} d
   * @param  {"message" | "channel" | "user" | "role" | 'guild' | "emoji" | "option" | "custom" } type
   * @param  {object} data
   * @param  {string | void} message
   * @returns {string}
   */
  static functionErrorResolve(d, type, data, message) {
    let ans;
    switch (type) {
      case "message":
        ans = `\`AoiError: ${d.func}: Invalid Message ID Provided In ${
          data.inside || ""
        } (line : ${d.funcLine})\``;
        break;
      case "channel":
        ans = `\`AoiError: ${d.func}: Invalid Channel ID Provided In ${
          data.inside || ""
        } (line : ${d.funcLine}\`)`;
        break;
      case "user":
        ans = `\`AoiError: ${d.func}: Invalid User ID Provided In ${
          data.inside || ""
        } (line : ${d.funcLine})\``;
        break;
      case "member":
        ans = `\`AoiError: ${d.func}: Invalid Member ID Provided In ${
          data.inside || ""
        } (line : ${d.funcLine})\``;
        break;
      case "role":
        ans = `\`AoiError: ${d.func}: Invalid Role Provided In ${
          data.inside || ""
        } (line : ${d.funcLine})\``;
        break;
      case "guild":
        ans = `\`AoiError: ${d.func}: Invalid Guild ID Provided In ${
          data.inside || ""
        } (line : ${d.funcLine})\``;
        break;
      case "emoji":
        ans = `\`AoiError: ${d.func}: Invalid Emoji ID Provided In ${
          data.inside || ""
        } (line : ${d.funcLine})\``;
        break;
      case "option":
        ans = `\`AoiError: ${d.func}: Invalid Option Provided In ${
          data.inside || ""
        } (line : ${d.funcLine})\``;
        break;
      case "custom":
        ans = `\`AoiError: ${d.func}: ${message} ${data.inside || ""} (line : ${
          d.funcLine
        })\``;
        break;
    }
    return ans;
  }

  //aoi.js system
  /**
   * @param  {object} d
   * @param  {"message" | "channel" | "user" | "role" | 'guild' | "emoji" | "option" | "custom" } type
   * @param  {object} data
   * @param  {string | void} message
   * @returns {void}
   */
  static fnError(d, type, data, message) {
    d.error(this.functionErrorResolve(d, type, data, message));
  }
}

module.exports = AoiError;
