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

async function extractEmoji(part, d) {
    if (!part) return null;
    if (Array.isArray(part)) part = part.join(":").trim().addBrackets();

    let emoji;

    if (part.startsWith(":") && part.endsWith(":"))
        return {
            id: null,
            name: part,
            animated: false
        };

    emoji = await d.util.getEmoji(d, part);
    if (!emoji) return null;
    return emoji;
}

/**
 * The Embed Parser.
 * @param {string} message The message to parse.
 * @returns {Promise<Array<import('discord.js').EmbedData>>}
 */
let EmbedParser = async (message) => {
    message = mustEscape(message);

    const embeds = [];

    const messages = message.split("{newEmbed:").slice(1);
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

/**
 * The Component Parser.
 * @param {string} message The message to parse.
 * @param {import('../index.d.ts').Data} d
 * @returns {Promise<Array<import('discord.js').ActionRowData>>}
 */
let ComponentParser = async (message, d) => {
    message = mustEscape(message);

    const actionRow = message.split("{actionRow:").slice(1);

    const actionRows = [];

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
                button = button?.split(/:(?![/][/])/).map((x) => x.trim().addBrackets());

                const label = button.shift();
                let style = isNaN(button[0]) ? button.shift() : Number(button.shift());
                style = ButtonStyleOptions[style] || style;
                const customId = button.shift();
                const disabled = button.shift()?.addBrackets().trim() === "true";

                let buttonInner = {
                    type: 2,
                    style: style,
                    label: label,
                    url: Number(style) === 5 ? customId : undefined,
                    custom_id: Number(style) !== 5 ? customId : undefined,
                    disabled: disabled
                };

                if (Number(style) === 6) {
                    buttonInner = {
                        type: 2,
                        style: ButtonStyle.Premium,
                        sku_id: customId,
                        disabled: disabled
                    };
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

            const selectMenuOptions = [];

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

                for (const type of opts) {
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
            const inside = content.split("{textInput:").slice(1);
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

/**
 * The Components V2 Parser.
 * @param {string} message The message to parse.
 * @param {import('../index.d.ts').Data} d
 * @returns {Promise<Array<
 *   import('discord.js').APIContainerComponent    |
 *   import('discord.js').APISectionComponent      |
 *   import('discord.js').APIMediaGalleryComponent |
 *   import('discord.js').APITextDisplayComponent  |
 *   import('discord.js').APISeparatorComponent
 * >>}
 */
let ComponentV2Parser = async (message, d) => {
    message = mustEscape(message);

    let comps = [];

    // Container Parser
    if (Checker(message, "newContainer")) {
        const contents = message.split("{newContainer:").slice(1);

        const containers = [];

        for (let content of contents) {
            content = content.slice(0, content.lastIndexOf("}"));

            const container = {
                type: 17,
                accent_color: null,
                spoiler: false,
                components: []
            };

            // Accent Color
            // {color:DiscordResolvableColor}
            if (Checker(content, "color")) {
                const color = extractParser(content, "color");
                container.accent_color = resolveColor(color);
            }

            // Spoiler?
            // {spoiler:boolean}
            if (Checker(content, "spoiler")) {
                const spoiler = extractParser(content, "spoiler");
                container.spoiler = spoiler?.toLowerCase()?.trim() === "true";
            }

            const components = CreateObjectAST(content);
            for (const component of components) {
                // Media Gallery
                // {gallery:...items}
                if (Checker(component, "gallery")) {
                    const gallery = parseGallery(component);
                    container.components.push(gallery);
                }

                // Action Row
                // {actionRow:...}
                if (Checker(component, "actionRow")) {
                    const rows = await ComponentParser(component, d);
                    container.components.push(...rows);
                }

                // Section
                // {section:...}
                if (Checker(component, "newSection")) {
                    const section = await parseSection(component, d);
                    container.components.push(section);
                } else if (Checker(component, "text")) {
                    const text = extractParser(component, "text");

                    container.components.push({
                        type: 10,
                        content: text
                    });
                }

                // Separator
                // {separator:divider?:spacing?}
                if (Checker(component, "separator")) {
                    const separator = extractParser(component, "separator");
                    container.components.push(parseSeparator(separator));
                }

                // File
                // {file:attachmentName:spoiler?}
                if (Checker(component, "file")) {
                    const file = extractParser(component, "file", true);
                    const spoiler = ["true", "false"].find((x) => x === file[file.length - 1]?.trim()) ? file.pop()?.trim() === "true" : false;
                    const filename = file.join(":").trim();

                    container.components.push({
                        type: 13,
                        file: { url: `attachment://${filename}` },
                        spoiler
                    });
                }
            }
            containers.push(container);
        }
        comps = containers;
    } else {
        // Determine the parser
        const parser = ["newSection", "gallery", "text", "separator"].find((x) => Checker(message, x));
        const contents = message.split(`{${parser}:`).slice(1);

        const components = [];

        for (let content of contents) {
            content = content.slice(0, content.lastIndexOf("}"));

            // Run the determined parser and add the response to the components
            components.push(
                parser === "text" ? { type: 10, content } : parser === "separator" ? parseSeparator(content) : parser === "section" ? await parseSection(content, d) : parseGallery(content)
            );
        }

        comps = components;
    }

    function parseSeparator(inside) {
        const args = inside.split(":");
        const divider = (args.shift() || "true")?.toLowerCase()?.trim() === "true";
        const spacing = Number(args.shift()?.trim());

        return {
            type: 14,
            divider,
            spacing
        };
    }

    function parseGallery(str) {
        const gallery = {
            type: 12,
            items: []
        };

        // Media Item
        // {media:URL:spoiler?:description?}
        if (Checker(str, "media")) {
            const inside = str.split("{media:").slice(1);

            for (const media of inside) {
                const insides = media
                    .split("}")[0]
                    ?.split(/:(?![/][/])/)
                    .map((x) => x.trim().addBrackets());

                const url = insides.shift();
                const spoiler = insides.shift()?.toLowerCase() === "true";
                const description = insides.join(":");

                gallery.items.push({
                    media: { url },
                    description: description.length ? description : undefined,
                    spoiler
                });
            }
        }
        return gallery;
    }

    async function parseSection(str, d) {
        const section = {
            type: 9,
            components: []
        };

        // Text Display
        // {text:content}
        if (Checker(str, "text")) {
            const textDisplays = str.split("{text:").slice(1);

            for (const display of textDisplays) {
                const text = display.split("}")[0]?.trim()?.addBrackets();
                section.components.push({
                    type: 10,
                    content: text
                });
            }
        }

        // Thumbnail Accessory
        // {thumbnail:URL:spoiler?:description?}
        if (Checker(str, "thumbnail")) {
            const thumbnail = extractParser(str, "thumbnail")
                ?.split(/:(?![/][/])/)
                .map((x) => x.trim().addBrackets());

            const url = thumbnail.shift();
            const spoiler = thumbnail.shift()?.toLowerCase() === "true";
            const description = thumbnail.join(":");

            section.accessory = {
                type: 11,
                description: description.length ? description : undefined,
                media: { url },
                spoiler
            };
        }

        // Button Accessory
        // {button:label:style:custom_id:disabled?:emoji?}
        if (Checker(str, "button")) {
            const button = extractParser(str, "button")
                ?.split(/:(?![/][/])/)
                .map((x) => x.trim().addBrackets());

            const label = button.shift();
            let style = isNaN(button[0]) ? button.shift() : Number(button.shift());
            style = ButtonStyleOptions[style] || style;
            const customId = button.shift();
            const disabled = button.shift()?.addBrackets().trim() === "true";

            let buttonInner = {
                type: 2,
                style: style,
                label: label,
                url: Number(style) === 5 ? customId : undefined,
                custom_id: Number(style) !== 5 ? customId : undefined,
                disabled: disabled
            };

            if (Number(style) === 6) {
                buttonInner = {
                    type: 2,
                    style: ButtonStyle.Premium,
                    sku_id: customId,
                    disabled: disabled
                };
            }

            if (button && Number(style) !== 6) {
                const emoji = await extractEmoji(button.join(":"), d);
                if (emoji) buttonInner.emoji = emoji;
            }

            section.accessory = buttonInner;
        }
        return section;
    }

    return comps;
};

/**
 * The File Parser.
 * @param {string} message The message to parse.
 * @returns {Array<import('discord.js').AttachmentBuilder>}
 */
let FileParser = (message) => {
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

            const attachment = new AttachmentBuilder(content, { name });

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

/**
 * @param {string} errorMessage The message to parse.
 * @param {import('../index.d.ts').Data} d
 * @param {boolean | undefined} returnMsg
 * @param {import('discord.js').Channel} channel
 */
let errorHandler = async (errorMessage, d, returnMsg = false, channel) => {
    errorMessage = errorMessage.trim();

    const options = {
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
        content: "",
        embeds: [],
        components: [],
        flags: []
    };

    async function parseEmbeds(part) {
        options.embeds.push(...(await EmbedParser(part)));
    }

    async function parseComponents(part, d) {
        options.components.push(...(await ComponentParser(part, d)));
    }

    async function parseComponentsV2(part, d) {
        options.components.push(...(await ComponentV2Parser(part, d)));
        options.flags.push(MessageFlags.IsComponentsV2);
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
        const cmdname = part.split(":")[1].split("}")[0].trim();
        const cmd = d.client.cmd?.awaited.find((x) => x.name === cmdname);
        if (!cmd) return console.error(`AoiError: Invalid awaited command '${cmdname}' in '{execute:${cmdname}}'`);
        await d.interpreter(d.client, d.message, d.args, cmd, d.client.db, false, undefined, d.data ?? []);
    }

    function parseInteraction(part) {
        const content = part.split(":");
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
        if (Checker(part, "newEmbed")) await parseEmbeds(part);
        else if (["newContainer", "newSection", "gallery", "text"].find((x) => Checker(part, x))) await parseComponentsV2(part, d);
        else if (Checker(part, "actionRow")) await parseComponents(part, d);
        else if (Checker(part, "attachment") || Checker(part, "file")) await parseFiles(part);
        else if (["edit", "deleteIn", "reactions"].find((x) => Checker(part, x))) await parseOptions(part, d);
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

    if (!options.embeds.length) options.context.send = false;
    if (options.context.send && options.context.suppress) options.context.send = false;

    const isCV2 = options.flags.includes(MessageFlags.IsComponentsV2);
    options.content = errorMessage.addBrackets() === "" ? " " : errorMessage.addBrackets();

    if (returnMsg === true) {
        return {
            embeds: !isCV2 ? (options.context.send ? options.embeds : []) : null,
            components: Array.isArray(options.components) ? options.components : [],
            content: !isCV2 ? options.content : null,
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
                content: !isCV2 ? options.content : undefined,
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

        if (returnMsg === "id") return message.id;
        if (["withMessage", "object"].includes(returnMsg)) {
            return message;
        }
    }
};

/**
 * @param {string} options The options to parse.
 * @returns {Promise<Array<import('discord.js').APIApplicationCommandOption>>}
 */
let SlashOptionsParser = async (options) => {
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

/**
 * @param {string} options The options to parse.
 * @param {import('../index.d.ts').Data} d
 * @returns {Promise<{
 *   edits: {
 *     time: number;
 *     messages: Array<Array<(import('discord.js').Message | undefined)>>;
 *   } | undefined;
 *   reactions: RegExpMatchArray | undefined;
 *   deleteIn: number | undefined;
 *   deleteCommand: boolean | undefined;
 * }>}
 */
let OptionParser = async (options, d) => {
    const optionData = {};

    // Edit
    // {edit:time:messages}
    if (Checker(options, "edit")) {
        const editPart = options.split("{edit:")[1].split("}")[0];
        const parts = editPart.split(":");
        const dur = parts[0];
        const messageParts = parts.slice(1);
        const messages = [];

        for (const msg of messageParts) {
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
