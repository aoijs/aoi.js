const { resolveColor, MessageFlags, AttachmentBuilder, ComponentType, ButtonStyle } = require("discord.js");
const SlashOption = require("./slashOption.js");
const { mustEscape } = require("../core/mustEscape.js");
const { ButtonStyleOptions } = require("../utils/Constants.js");
const { CreateObjectAST } = require("../core/functions.js");
const { Time } = require("../core/Time.js");

// Matches parser with args
// {parser:...}
const Checker = (content, parser) => content.includes(`{${parser}:`);

// Matches single parser
// {parser}
const SingleChecker = (content, parser) => content.includes("{" + parser + "}");

const extractParser = (content, parser, more) => (more ? content.split(`{${parser}:`)[1].split("}")[0].split(":") : content.split(`{${parser}:`)[1].split("}")[0].addBrackets().trim());

const EmbedParser = async (message) => {
    message = mustEscape(message);

    const embeds = [];

    let messages = message.split("{newEmbed:").slice(1);
    for (let content of messages) {
        content = content.slice(0, content.length - 1);

        const embed = {};
        embed.fields = [];

        // Author
        // {author:Name:IconURL?}
        if (Checker(content, "author")) {
            const authorField = extractParser(content, "author", true);
            embed.author = {
                name: authorField.shift().addBrackets()?.trim() || "",
                icon_url: authorField.join(":").addBrackets()?.trim() || ""
            };
        }

        // Author URL
        // {authorURL:URL}
        if (Checker(content, "authorURL")) {
            if (!embed.author) return console.error("{author:} was not used");
            embed.author.url = extractParser(content, "authorURL");
        }

        // Title
        // {title:Text}
        if (Checker(content, "title")) {
            embed.title = extractParser(content, "title");
        }

        // Title URL
        // {url:URL}
        if (Checker(content, "url")) {
            if (!embed.title) return console.error("Title was not provided while using {url}");
            embed.url = extractParser(content, "url");
        }

        // Description
        // {description:Text}
        if (Checker(content, "description")) {
            embed.description = extractParser(content, "description");
        }

        // Thumbnail
        // {thumbnail:URL}
        if (Checker(content, "thumbnail")) {
            embed.thumbnail = {
                url: extractParser(content, "thumbnail")
            };
        }

        // Image
        // {image:URL}
        if (Checker(content, "image")) {
            embed.image = {
                url: extractParser(content, "image")
            };
        }

        // Footer
        // {footer:Text:IconURL?}
        if (Checker(content, "footer")) {
            const footerField = extractParser(content, "footer", true);
            embed.footer = {
                text: footerField.shift().addBrackets().trim() || "",
                icon_url: footerField.join(":").addBrackets().trim() || ""
            };
        }

        // Color
        // {color:DiscordResolvableColor}
        if (Checker(content, "color")) {
            const color = extractParser(content, "color");
            embed.color = resolveColor(color);
        }

        // Timestamp
        // {timestamp:time}
        if (Checker(content, "timestamp")) {
            let timestampField = extractParser(content, "timestamp");
            try {
                timestampField = Time.parse(t)?.ms;
            } catch {
                timestampField = Date.now();
            }

            embed.timestamp = new Date(timestampField);
        }

        // {timestamp}
        if (SingleChecker(content, "timestamp")) {
            const timestampField = Date.now();
            embed.timestamp = new Date(timestampField);
        }

        // Fields
        // {field:Title:Description:Inline?}
        if (Checker(content, "field")) {
            const fieldContent = content.split("{field:").slice(1);
            for (let fieldInner of fieldContent) {
                fieldInner = fieldInner.split("}")[0].match(/(?:<[^>]+>|[^:])+/g);

                const fieldTitle = fieldInner.shift().addBrackets().trim();
                const fieldInline = ["true", "false"].find((x) => x === fieldInner[Number(fieldInner.length - 1)].trim()) ? fieldInner.pop().trim() === "true" : false;
                const fieldValue = fieldInner.join(":").addBrackets().trim();

                embed.fields.push({ name: fieldTitle, value: fieldValue, inline: fieldInline });
            }
        }
        embeds.push(embed);
    }
    return embeds;
};

const ComponentParser = async (message, d) => {
    message = mustEscape(message);

    let actionRow = message.split("{actionRow:").slice(1);

    const actionRows = [];

    async function extractEmoji(part, d) {
        if (!part) return null;
        let emoji;

        if (part.length === 3) {
            return part.join(":").trim();
        }

        emoji = await d.util.getEmoji(d, part.toString());
        if (!emoji) {
            emoji = part.toString().addBrackets().trim();
        } else {
            emoji = {
                name: emoji.name,
                id: emoji.id,
                animated: emoji.animated
            };
        }
        return emoji;
    }

    for (let content of actionRow) {
        const index = content.lastIndexOf("}");
        content = content.slice(0, index);

        const actionRowInner = [];

        // Button
        // {button:label:style:custom_id:disabled?:emoji?}
        if (Checker(content, "button")) {
            const inside = content.split("{button:").slice(1);

            for (let button of inside) {
                button = button?.split("}")[0];
                button = button
                    ?.addBrackets()
                    .split(/:(?![/][/])/)
                    .map((x) => x.trim());

                const label = button.shift();
                let style = isNaN(button[0]) ? button.shift() : Number(button.shift());
                style = ButtonStyleOptions[style] || style;
                const customId = button.shift();
                const disabled = button.shift()?.addBrackets().trim() === "true";

                let buttonInner;

                switch (Number(style)) {
                    case 5:
                        buttonInner = {
                            label: label,
                            type: 2,
                            style: ButtonStyle.Link,
                            url: customId,
                            disabled: disabled
                        };
                        break;
                    case 6:
                        buttonInner = {
                            type: 2,
                            style: ButtonStyle.Premium,
                            sku_id: customId,
                            disabled: disabled
                        };
                        break;
                    default:
                        buttonInner = {
                            label: label,
                            type: 2,
                            style: style,
                            custom_id: customId,
                            disabled: disabled
                        };
                        break;
                }

                if (button && Number(style) !== 6) {
                    const emoji = await extractEmoji(button, d);
                    if (emoji) buttonInner.emoji = emoji;
                }

                actionRowInner.push(buttonInner);
            }
        }

        // Select Menu
        // {selectMenu:custom_id:placeholder:minValues:maxValues:disabled?:...options}
        if (Checker(content, "selectMenu")) {
            let inside = content.split("{selectMenu:").slice(1).join("");
            inside = inside.split(":").map((c) => c.trim());

            const customId = inside.shift();
            const placeholder = inside.shift();
            const minVal = inside[0] === "" ? 0 : Number(inside.shift());
            const maxVal = inside[0] === "" ? 1 : Number(inside.shift());
            const disabled = inside.shift() === "true";
            const options = inside.join(":").trim();

            let selectMenuOptions = [];

            // String Input
            // {stringInput:label:value:description:defaultOption?}
            if (options.includes("{stringInput:")) {
                const opts = options.split("{stringInput:").slice(1);

                for (let opt of opts) {
                    opt = opt?.split("}")[0];
                    opt = opt
                        ?.addBrackets()
                        .split(/:(?![/][/])/)
                        .map((x) => x.trim());

                    const label = opt.shift();
                    const value = opt.shift();
                    const description = opt.shift();
                    const defaultOption = opt.shift()?.addBrackets().trim() === "true";

                    const selectMenuInner = {
                        label: label,
                        value: value,
                        description: description,
                        default: defaultOption
                    };

                    if (opt) {
                        const emoji = await extractEmoji(opt, d);
                        if (emoji) selectMenuInner.emoji = emoji;
                    }

                    selectMenuOptions.push(selectMenuInner);
                }
            }

            // Default
            if (selectMenuOptions.length > 0) {
                actionRowInner.push({
                    type: 3,
                    custom_id: customId,
                    placeholder: placeholder,
                    min_values: minVal,
                    max_values: maxVal,
                    disabled,
                    options: selectMenuOptions
                });
            }

            // User Input
            if (options.includes("{userInput}")) {
                actionRowInner.push({
                    type: ComponentType.UserSelect,
                    custom_id: customId,
                    placeholder: placeholder,
                    min_values: minVal,
                    max_values: maxVal,
                    disabled
                });
            }

            // Role Input
            if (options.includes("{roleInput}")) {
                actionRowInner.push({
                    type: ComponentType.RoleSelect,
                    custom_id: customId,
                    placeholder: placeholder,
                    min_values: minVal,
                    max_values: maxVal,
                    disabled
                });
            }

            // Mentionable Input
            if (options.includes("{mentionableInput}")) {
                actionRowInner.push({
                    type: ComponentType.MentionableSelect,
                    custom_id: customId,
                    placeholder: placeholder,
                    min_values: minVal,
                    max_values: maxVal,
                    disabled
                });
            }

            // Channel Input
            // {channelInput:Text:Voice:...}
            if (options.includes("{channelInput:")) {
                const opts = options.split("{channelInput:").slice(1);

                const channel_types = [];

                for (let type of opts) {
                    const opts = type.split("}")[0].split(":");
                    for (let t of opts) {
                        if (!d.util.channelTypes[t]) t = "Text";
                        channel_types.push(d.util.channelTypes[t]);
                    }
                }

                actionRowInner.push({
                    type: ComponentType.ChannelSelect,
                    custom_id: customId,
                    placeholder: placeholder,
                    min_values: minVal,
                    max_values: maxVal,
                    channel_types,
                    disabled
                });
            }

            // Channel Input (default)
            // {channelInput}
            if (options.includes("{channelInput}")) {
                actionRowInner.push({
                    type: ComponentType.ChannelSelect,
                    custom_id: customId,
                    placeholder: placeholder,
                    min_values: minVal,
                    max_values: maxVal,
                    disabled
                });
            }
        }

        // Text Input
        // {textInput:label:style:custom_id:required?:placeholder?:min_length?:max_length?:value?}
        if (Checker(content, "textInput")) {
            let inside = content.split("{textInput:").slice(1);
            for (let textInput of inside) {
                textInput = textInput.split("}")[0].split(":");

                const label = textInput.shift().addBrackets().trim();
                let style = textInput.shift().addBrackets().trim();
                style = isNaN(style) ? style : Number(style);

                const customId = textInput.shift().addBrackets().trim();
                const required = textInput.shift()?.addBrackets().trim() === "true";
                const placeholder = textInput.shift()?.addBrackets().trim();
                const min_length = textInput.shift()?.addBrackets().trim();
                const max_length = textInput.shift()?.addBrackets().trim();
                const value = textInput.shift()?.addBrackets().trim();

                actionRowInner.push({
                    type: 4,
                    label,
                    style,
                    custom_id: customId,
                    required,
                    placeholder,
                    min_length,
                    max_length,
                    value
                });
            }
        }
        actionRows.push({ type: 1, components: actionRowInner });
    }
    return actionRows;
};

const FileParser = (message) => {
    message = mustEscape(message);

    const attachments = [];

    // Attachment
    // {attachment:name:content}
    if (Checker(message, "attachment")) {
        const content = message
            ?.split("{attachment:")
            ?.slice(1)
            .map((x) => x.trim());
        for (let attachmentInner of content) {
            attachmentInner = attachmentInner.split("}")[0];
            attachmentInner = attachmentInner.split(/:(?![/][/])/);

            const content = attachmentInner.pop().addBrackets();
            const name = attachmentInner.join(":").toString().addBrackets() ?? "attachment.png";

            const attachment = new AttachmentBuilder(content, {
                name
            });

            attachments.push(attachment);
        }
    }

    // File
    // {file:name:content}
    if (Checker(message, "file")) {
        const content = message
            .split("{file:")
            ?.slice(1)
            .map((x) => x.trim());
        for (let fileInner of content) {
            fileInner = fileInner.split("}")[0];
            fileInner = fileInner.split(/:(?![/][/])/);

            const content = fileInner.pop().addBrackets();
            const name = fileInner.join(":").toString().addBrackets() ?? "file.txt";

            const attachment = new AttachmentBuilder(Buffer.from(content), { name });

            attachments.push(attachment);
        }
    }
    return attachments;
};

const errorHandler = async (errorMessage, d, returnMsg = false, channel) => {
    errorMessage = errorMessage.trim();

    let options = {
        context: {
            send: true,
            deleteCommand: false,
            deleteIn: undefined,
            suppress: false
        },
        interaction: {
            interaction: false,
            defer: false,
            ephemeral: false
        },
        reply: {
            message: undefined,
            mention: true
        },
        edits: {
            time: null,
            messages: []
        },
        allowedMentions: {
            parse: ["everyone", "users", "roles"],
            repliedUser: false
        },
        files: [],
        reactions: [],
        embeds: [],
        components: [],
        flags: []
    };

    async function parseEmbeds(part, d) {
        options.embeds.push(...(await EmbedParser(part, d)));
    }

    async function parseComponents(part, d) {
        options.components.push(...(await ComponentParser(part, d)));
    }

    function parseFiles(part) {
        options.files.push(...FileParser(part));
    }

    async function parseOptions(part, d) {
        const optionData = await OptionParser(part, d);
        if (optionData.edits !== undefined) options.edits = optionData.edits;
        if (optionData.reactions !== undefined) options.reactions = optionData.reactions;
        if (optionData.deleteIn !== undefined) options.context.deleteIn = optionData.deleteIn;
        if (optionData.deleteCommand !== undefined) options.context.deleteCommand = optionData.deleteCommand;
    }

    function parseReply(part) {
        const content = extractParser(part, "reply", true);
        options.reply = {
            message: content[0].trim(),
            mention: content[1]?.trim() === "true"
        };
    }

    async function parseExecute(part, d) {
        let cmdname = part.split(":")[1].split("}")[0].trim();
        const cmd = d.client.cmd?.awaited.find((x) => x.name === cmdname);
        if (!cmd) return console.error(`AoiError: Invalid awaited command '${cmdname}' in '{execute:${cmdname}}'`);
        await d.interpreter(d.client, d.message, d.args, cmd, d.client.db, false, undefined, d.data ?? []);
    }

    function parseInteraction(part) {
        let content = part.split(":");
        options.interaction.interaction = true;
        options.interaction.defer = content[1] ? content[1].split("}")[0].trim() === "true" : false;
    }

    function parseAllowedMentions(part) {
        const parts = part.split("}")[0].split(":").slice(1);
        if (parts.includes("all")) options.allowedMentions.parse = ["everyone", "users", "roles"];
        else if (parts.includes("none")) options.allowedMentions.parse = [];
        else if (parts.includes("")) options.allowedMentions.parse = [];
        else options.allowedMentions.parse = [...parts];
    }

    function parseFlags(part) {
        const parts = part.split("}")[0].split(":").slice(1);
        options.flags.push(parts.map((x) => MessageFlags[x.trim()]));
    }

    const parts = CreateObjectAST(errorMessage);
    for (const part of parts) {
        errorMessage = errorMessage.replace(part, "");
        if (Checker(part, "newEmbed")) await parseEmbeds(part, d);
        else if (Checker(part, "actionRow")) await parseComponents(part, d);
        else if (Checker(part, "attachment") || Checker(part, "file")) await parseFiles(part);
        else if (Checker(part, "edit") || Checker(part, "deleteIn") || Checker(part, "reactions")) await parseOptions(part, d);
        else if (Checker(part, "reply")) parseReply(part);
        else if (Checker(part, "suppress")) options.context.suppress = true;
        else if (Checker(part, "execute")) await parseExecute(part, d);
        else if (SingleChecker(part, "deleteCommand")) options.context.deleteCommand = true;
        else if (SingleChecker(part, "interaction")) options.interaction.interaction = true;
        else if (Checker(part, "interaction")) parseInteraction(part);
        else if (SingleChecker(part, "ephemeral")) options.interaction.ephemeral = true;
        else if (Checker(part, "allowedMentions")) parseAllowedMentions(part);
        else if (Checker(part, "flags")) parseFlags(part);
    }

    if (!options.embeds.length) send = false;
    if (options.context.send && options.context.suppress) send = false;

    if (returnMsg === true) {
        return {
            embeds: options.context.send ? options.embeds : [],
            components: options.components,
            content: errorMessage.addBrackets() === "" ? " " : errorMessage.addBrackets(),
            files: options.files,
            allowedMentions: options.allowedMentions,
            flags: options.flags,
            options: {
                reply: options.reply,
                reactions: options.reactions.length ? options.reactions : undefined,
                ephemeral: options.interaction.ephemeral,
                suppress: options.context.suppress,
                interaction: options.interaction.interaction,
                defer: options.interaction.defer,
                edits: options.edits.edits,
                deleteIn: options.context.deleteIn,
                deleteCommand: options.context.deleteCommand
            }
        };
    }

    errorMessage = errorMessage.addBrackets().trim();
    if (!(errorMessage.length || options.context.send || options.files.length)) return;

    const targetChannel = channel || d.channel;

    if ((errorMessage.length || options.context.send || options.files.length) && d && targetChannel && !returnMsg) {
        const message = await targetChannel
            .send({
                content: errorMessage.addBrackets(),
                embeds: options.context.send ? options.embeds : [],
                files: options.files?.length ? options.files : []
            })
            .catch(() => {});

        if (!message) return;

        if (message && reactions.length) {
            for (const reaction of options.reactions) {
                await message.react(reaction).catch(console.error);
            }
        }

        if (message && deleteIn) {
            message
                .delete({
                    timeout: options.context.deleteIn
                })
                .catch(() => null);
        }

        if (returnMsg === "id") {
            return message.id;
        } else if (["withMessage", "object"].includes(returnMsg)) {
            return message;
        }
    }
};

const SlashOptionsParser = async (options) => {
    options = mustEscape(options);

    let Alloptions = [];
    options = options.trim();

    if (Checker(options, "subGroup")) {
        Alloptions = Alloptions.concat(await SlashOption.subGroup(options));
    }
    if (Checker(options, "subCommand") && !Checker(options, "subGroup")) {
        Alloptions = Alloptions.concat(await SlashOption.subCommand(options));
    }
    if (Checker(options, "string") && !(Checker(options, "subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.string(options));
    }
    if (Checker(options, "integer") && !(Checker(options, "subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.integer(options));
    }
    if (Checker(options, "boolean") && !(Checker(options, "subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.boolean(options));
    }
    if (Checker(options, "user") && !(Checker(options, "subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.user(options));
    }
    if (Checker(options, "channel") && !(Checker(options, "subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.channel(options));
    }
    if (Checker(options, "role") && !(Checker(options, "subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.role(options));
    }
    if (Checker(options, "mentionable") && !(Checker(options, "subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.mentionable(options));
    }
    if (Checker(options, "number") && !(Checker(options, "subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.number(options));
    }

    return Alloptions;
};

const OptionParser = async (options, d) => {
    const optionData = {};

    // Edit
    // {edit:time:messages}
    if (Checker(options, "edit")) {
        const editPart = options.split("{edit:")[1].split("}")[0];
        const parts = editPart.split(":");
        const dur = parts[0];
        const messageParts = parts.slice(1);
        const messages = [];

        for (let msg of messageParts) {
            messages.push(await errorHandler(msg, d, true));
        }

        optionData.edits = {
            time: Time.parse(dur)?.ms,
            messages: [messages]
        };
    }

    // Reactions
    // {reactions:...emojis}
    const reactionParser = (reactions) => {
        const regex = /(<a?:\w+:[0-9]+>)|\p{Extended_Pictographic}/gu;
        const matches = reactions.match(regex);
        if (!matches) return [];
        return matches;
    };

    if (Checker(options, "reactions")) {
        const reactions = reactionParser(options.split(":").slice(1).join(":").replace("}", ""));
        optionData.reactions = reactions;
    }

    // DeleteIn
    // {deleteIn:time}
    if (Checker(options, "deleteIn")) {
        const time = extractParser(options, "deleteIn");
        optionData.deleteIn = Time.parse(time)?.ms;
    }

    if (SingleChecker(options, "deletecommand")) {
        optionData.deleteCommand = true;
    }

    return optionData;
};

module.exports = {
    EmbedParser,
    ComponentParser,
    FileParser,
    ErrorHandler: errorHandler,
    SlashOptionsParser,
    OptionParser
};
