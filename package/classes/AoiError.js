const { ComponentParser, EmbedParser, FileParser } = require('../Handler/parsers.js')
const Util = require('./Util.js');
const { Time } = require('../Utils/helpers/customParser.js')
class AoiError {
    /**
      *@params : none 
      *@note : should not be initialised using "new" 
      */
    constructor() {
        const error = new Error(`Cannot Initialise "AoiError" Class`)
        error.name = "AoiError"
        throw error;
    }
    /**
      *@params (callback : callback that call this function )  (intent : intent that callback uses)
      *@type : (CallbackError)
      */
    static CallbackError(callback, intent, line) {
        const error = new Error(`(Missing Intents) : "${callback}" requires "${intent}" intent.`);
        error.name = "CallbackError";
        error.fileName = "./Bot.js"
        error.lineNumber = line
        throw error;
    }
    /**
      *@params (command: which called the error) (type: type of command Error (options : "name" & "code")) (name: name property of the command) (position: position of that command in the collection)
      *@type: (CommandNameError || CommandCodeError)
      */
    static CommandError(command, type, name, position) {
        if (type === "name") {
            const error = new Error(`"name" property is missing in "${command}" (position: ${position})`)
            error.name = "CommandNameError"
            throw error
        }
        else if (type === "code") {
            const error = new Error(`"code" is not provided in "${name || "the Command"}" : ${command} (position: ${position})`)
            error.name = "CommandCodeError"
            throw error
        }
    }
    /**
      *@params (client : Bot Class) (channelID : ID of the Channel Wherr this Error Would Be sent) (options:MessageOptions (content, embeds, components, allowedMentions,files)
      *@type : (CustomError)
      */
    static async makeMessageError(client, channel, options = {}, extraOptions = {}, d) {
        options.content = options.content?.trim() || ' ';
        if (options.embeds && typeof options.embeds === "string") {
            options.embeds = await EmbedParser(options.embeds)
        }
        if (options.files && typeof options.files === "string") {
            options.files = await FileParser(options.files)
        }
        if (options.components && typeof options.components === "string") {
            options.components = await ComponentParser(options.componenents, client)
        }
        console.log({ extraOptions, message: extraOptions.edits?.messages })
        let msg;
        if (extraOptions.interaction) {
            msg = await d.data.interaction.reply(options);
        }
        else {
            msg = await channel.send(options);
        }

        if (extraOptions.reactions?.length) {
            console.log("re working")
            extraOptions.reactions.forEach(x => msg.react(x))
        }
        if (extraOptions.edits) {
            const editIn = setInterval(async () => {
                if (!extraOptions.edits.messages?.length) clearInterval(editIn)
                else {
                    const obj = await Util.errorParser(JSON.stringify(extraOptions.edits.messages.shift()), d)
                    console.log({ obj })
                    msg.edit(obj)
                }
            }, Time.parse(extraOptions.edits.time)?.ms)
        }
        if (extraOptions.deleteIn) {
            setTimeout(() => msg.delete(), extraOptions.deleteIn)
        }
        if (extraOptions.deleteCommand) {
            d.message.delete()
        }
        return msg;
    }
    static consoleError(name, e) {
        return console.error(`${name}: ${e}`)
    }
    static functionErrorResolve(d, type, data, message) {
        let ans;
        switch (type) {
            case "message":
                ans = `\`${d.func}:Invalid MessageId Provided In ${data.inside || ""}\` (line : ${d.funcLine})`
                break;
            case "channel":
                ans = `\`${d.func}:Invalid ChannelId Provided In ${data.inside || ""}\` (line : ${d.funcLine})`
                break;
            case "user":
                ans = `\`${d.func}: Invalid UserId Provided In ${data.inside || ""}\` (line : ${d.funcLine})`
                break;
            case "role":
                ans = `\`${d.func}:Invalid Role Provided In ${data.inside || ""}\` (line : ${d.funcLine})`
                break;
            case "guild":
                ans = `\`${d.func}:Invalid GuildId Provided In ${data.inside || ""}\` (line : ${d.funcLine})`
                break;
            case "emoji":
                ans = `\`${d.func}:Invalid EmojiId Provided In ${data.inside || ""}\` (line : ${d.funcLine})`
                break;
            case "option":
                ans = `\`${d.func}:Invalid Option Provided In ${data.inside || ""}\` (line : ${d.funcLine})`
                break;
            case "custom":
                ans = `\`${d.func}:${message} ${data.inside || ""}\` (line : ${d.funcLine})`
                break;
        }
        return ans
    }
    static fnError(d, type, data, message) {
        d.error(this.functionErrorResolve(d, type, data, message))
    }
}
module.exports = AoiError;