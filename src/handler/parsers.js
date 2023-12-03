const Discord = require("discord.js");
const { mustEscape } = require("../utils/helpers/mustEscape.js");
const { ButtonStyleOptions } = require("../utils/Constants.js");
const Util = require("../classes/Util.js");
const SlashOption = require("./slashOption.js");
const { Time } = require("../utils/helpers/customParser.js");
const { CreateObjectAST } = require("../utils/helpers/functions.js");

const SlashOptionsParser = async (options) => {
    options = mustEscape(options);

    let Alloptions = [];
    options = options.trim();
    const Checker = (msg) => options.includes("{" + msg + ":");

    if (Checker("subGroup")) {
        Alloptions = Alloptions.concat(await SlashOption.subGroup(options));
    }
    if (Checker("subCommand") && !Checker("subGroup")) {
        Alloptions = Alloptions.concat(await SlashOption.subCommand(options));
    }
    if (Checker("string") && !(Checker("subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.string(options));
    }
    if (Checker("integer") && !(Checker("subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.integer(options));
    }
    if (Checker("boolean") && !(Checker("subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.boolean(options));
    }
    if (Checker("user") && !(Checker("subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.user(options));
    }
    if (Checker("channel") && !(Checker("subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.channel(options));
    }
    if (Checker("role") && !(Checker("subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.role(options));
    }
    if (
        Checker("mentionable") &&
        !(Checker("subCommand") || Checker("subGroup"))
    ) {
        Alloptions = Alloptions.concat(await SlashOption.mentionable(options));
    }
    if (Checker("number") && !(Checker("subCommand") || Checker("subGroup"))) {
        Alloptions = Alloptions.concat(await SlashOption.number(options));
    }

    return Alloptions;
};

/**
 * This function check if the given text is boolean true or false.
 * @param {string} text - The text to check.
 * @param {boolean} orelse - The boolean to return if its not boolean.
 * @returns {boolean} - The result.
*/
let checkBoolean = (text, orelse) => {
    if (orelse && typeof orelse !== "boolean") return;
    if (!text  || typeof text   !== "string" ) return orelse;

    if ( text && text.trim() && (text.trim() === "" || text.trim() === " ") ) 
        return orelse;

    return text?.trim()?.toLowerCase() === "true" ? true : (text?.trim()?.toLowerCase() === "false" ? false : orelse);
};

let ctypes = {
    text: 0,
    voice: 2,
    category: 4,
    announce: 5,
    announcement: 5,
    "announce thread": 10,
    "announcement thread": 10,
    "public thread": 11,
    "private thread": 12,
    "stage": 13,
    forum: 15,
    media: 16
};

module.exports = {
  parsers: {
    // Parsers list
    EmbedParser: {
      name: ["newEmbed", "Embed"],
      code: async (d, data) => {
        let code = mustEscape(data.part);
        let parserName = "newEmbed";

        if (data.Checker(code, "Embed")) parserName = "Embed";

        let elements = code.split("{" + parserName + ":").slice(1);

        const embeds = [];

        for (let element of elements) {
          let embed = {
            fields: [],
          };

          element = element.slice(0, element.length - 1);

          const Checker = (name) => element.includes(`{${name}:`);

          if (Checker("author")) {
            const params = element
              .split("{author:")[1]
              .split("}")[0]
              .split(":");

            embed.author = {
              name: params.shift().addBrackets()?.trim() || "",
              icon_url: params.join(":").addBrackets()?.trim() || "",
            };
          }

          if (Checker("authorURL")) {
            if (!embed.author) return console.error("{author:} was not used");

            embed.author.url = element
              .split("{authorURL:")[1]
              .split("}")[0]
              .addBrackets()
              .trim();
          }

          if (Checker("color")) {
            embed.color = Discord.resolveColor(
              element.split("{color:")[1].split("}")[0].addBrackets().trim(),
            );
          }

          if (Checker("title")) {
            embed.title = element
              .split("{title:")[1]
              .split("}")[0]
              .addBrackets()
              .trim();
          }

          if (Checker("url")) {
            if (!embed.title)
              return console.error("Title was not provided while using {url}");

            embed.url = element
              .split("{url:")[1]
              .split("}")[0]
              .addBrackets()
              .trim();
          }

          if (Checker("thumbnail")) {
            embed.thumbnail = {
              url: element
                .split("{thumbnail:")[1]
                .split("}")[0]
                .addBrackets()
                .trim(),
            };
          }

          if (Checker("description")) {
            embed.description = element
              .split("{description:")[1]
              .split("}")[0]
              .addBrackets()
              .trim();
          }

          if (Checker("image")) {
            embed.image = {
              url: element
                .split("{image:")[1]
                .split("}")[0]
                .addBrackets()
                .trim(),
            };
          }

          if (Checker("footer")) {
            const params = element
              .split("{footer:")[1]
              .split("}")[0]
              .split(":");

            embed.footer = {
              text: params.shift().addBrackets().trim() || "",
              icon_url: params.join(":").addBrackets().trim() || "",
            };
          }

          if (element.includes("{timestamp")) {
            let time = element
              .split("{timestamp")[1]
              .split("}")[0]
              .replace(":", "")
              .trim();

            if (time === "" || time === "ms") {
              time = Date.now();
            }

            embed.timestamp = new Date(time);
          }

          if (Checker("field")) {
            const params = element.split("{field:").slice(1);
            for (let param of params) {
              param = param.split("}")[0].split(":");
              const name = param.shift().addBrackets().trim();
              const inline = checkBoolean(param[Number(param.length - 1)]);

              const value = param.join(":").addBrackets().trim();
              embed.fields.push({ name: name, value: value, inline: inline });
            }
          }

          embeds.push(embed);
        }

        if (data && data.newMessageData && data.newMessageData.embeds) data.newMessageData.embeds.push(...embeds);
        return embeds;
      },
    },
    ComponentParser: {
        name: ["actionRow", "Components", "newRow"],
        code: async (d, data) => {
            let code = mustEscape(data.part);
            let parserName = "actionRow";
        
            if (data.Checker(code, "Components"))
                parserName = "Components";
            else if (data.Checker(code, "newRow"))
                parserName = "newRow";
        
            let elements = code.split("{" + parserName + ":").slice(1);
        
            let rows = [];
        
            for (var element of elements) {
                element = element.slice(0, element.lastIndexOf("}"));
        
                const Checker = (name) => element.includes(`{${name}:`);

                let components = [];
        
                if (Checker("button")) {
                    let buttons = element.split("{button:").slice(1);

                    for (let params of buttons) {
                        params = params?.split("}")[0]?.split(":").map((param) => param?.addBrackets()?.trim());
        
                        let button = {
                            type: 2
                        };
            
                        const label = params?.shift();
                        let style = params?.shift();
                        const IDorURL = params?.shift();
                        const disabled = checkBoolean(params?.shift(), false);
                        let emoji = params.length !== 0 ? params.join(":") : undefined;
            
                        style = ButtonStyleOptions[style] || style;
            
                        if (style && Number(style) === 5)
                            button.url = IDorURL;
                        else
                            button.custom_id = IDorURL;
            
                        if (emoji) {
                            let [animated, name, id] = emoji.split(":");
                            if (!name && !id) {
                                name = animated;
                                id = "";
                                animated = "";
                            };
            
                            id = id.replace(">", "");
                            emoji = {
                                name: name,
                                id: id === "" ? undefined : id,
                                animated: animated.replace("<", "") === "a"
                            };
                        };
            
                        button.label = label;
                        button.style = style;
                        button.disabled = disabled;
                        button.emoji = emoji;
            
                        components.push(button);
                    }
                }
        
                if (Checker("selectMenu") || Checker("stringSelectMenu")) {
                    let inside = Checker("stringSelectMenu") ? element.split("{stringSelectMenu:").slice(1).join("").split(":").map((param) => param.trim()) : element.split("{selectMenu:").slice(1).join("").split(":").map((param) => param.trim());

                    const ID = inside?.shift()?.addBrackets();
                    const placeholder = inside?.shift()?.addBrackets();
                    const minValues = inside[0] === "" ? 0 : Number(inside?.shift()?.addBrackets());
                    const maxValues = inside[0] === "" ? 1 : Number(inside?.shift()?.addBrackets());
                    const disabled = checkBoolean(inside?.shift()?.addBrackets(), false);
                    const options = inside?.join(":");

                    let stringSelectMenu = {
                        type: 3,
                        custom_id: ID,
                        placeholder: placeholder,
                        min_values: minValues,
                        max_values: maxValues,
                        disabled,
                        options: []
                    };

                    if (options.includes("{selectMenuOptions:") || options.includes("{selectMenuOption:") || options.includes("{option:")) {
                        let smosORsmORo = "selectMenuOptions";
                        if (options.includes("{selectMenuOption:"))
                            smosORsmORo = "selectMenuOption";
                        else if (options.includes("{option:"))
                            smosORsmORo = "option";

                        const allOptions = options.split(`{${smosORsmORo}:`).slice(1);

                        for (var option of allOptions) {
                            option = option.split("}")[0].split(":");

                            let selectMenuOption = { };

                            const label = option?.shift()?.trim();
                            const value = option?.shift()?.trim();
                            const description = option?.shift()?.trim();
                            const def = checkBoolean(option?.shift()?.trim(), false);
                            let emoji = option.length !== 0 ? option?.join(":")?.trim()?.addBrackets() : undefined;

                            if (emoji) {
                                let [animated, name, id] = emoji.split(":");
                                if (!name && !id) {
                                    name = animated;
                                    id = "";
                                    animated = "";
                                };
                
                                id = id.replace(">", "");
                                emoji = {
                                    name: name,
                                    id: id === "" ? undefined : id,
                                    animated: animated.replace("<", "") === "a"
                                };
                            };

                            selectMenuOption.label = label;
                            selectMenuOption.value = value;
                            selectMenuOption.description = description;
                            selectMenuOption.default = def;
                            
                            if (emoji) selectMenuOption.emoji = emoji;

                            stringSelectMenu.options.push(selectMenuOption);
                        };
                    };

                    components.push(stringSelectMenu);
                }

                if (Checker("userSelectMenu")) {
                    let inside = element.split("{userSelectMenu:").slice(1).join("").split(":").map((param) => param?.addBrackets()?.trim());

                    const ID = inside?.shift();
                    const placeholder = inside?.shift();
                    const minValues = inside[0] === "" ? 0 : Number(inside?.shift());
                    const maxValues = inside[0] === "" ? 1 : Number(inside?.shift());
                    const disabled = checkBoolean(inside?.shift(), false);

                    let stringSelectMenu = {
                        type: 5,
                        custom_id: ID,
                        placeholder: placeholder,
                        min_values: minValues,
                        max_values: maxValues,
                        disabled
                    };

                    components.push(stringSelectMenu);
                }

                if (Checker("roleSelectMenu")) {
                    let inside = element.split("{roleSelectMenu:").slice(1).join("").split(":").map((param) => param?.addBrackets()?.trim());

                    const ID = inside?.shift();
                    const placeholder = inside?.shift();
                    const minValues = inside[0] === "" ? 0 : Number(inside?.shift());
                    const maxValues = inside[0] === "" ? 1 : Number(inside?.shift());
                    const disabled = checkBoolean(inside?.shift(), false);

                    let stringSelectMenu = {
                        type: 6,
                        custom_id: ID,
                        placeholder: placeholder,
                        min_values: minValues,
                        max_values: maxValues,
                        disabled,
                    };

                    components.push(stringSelectMenu);
                }

                if (Checker("mentionSelectMenu")) {
                    let inside = element.split("{mentionSelectMenu:").slice(1).join("").split(":").map((param) => param?.addBrackets()?.trim());

                    const ID = inside?.shift();
                    const placeholder = inside?.shift();
                    const minValues = inside[0] === "" ? 0 : Number(inside?.shift());
                    const maxValues = inside[0] === "" ? 1 : Number(inside?.shift());
                    const disabled = checkBoolean(inside?.shift(), false);

                    let stringSelectMenu = {
                        type: 7,
                        custom_id: ID,
                        placeholder: placeholder,
                        min_values: minValues,
                        max_values: maxValues,
                        disabled,
                    };

                    components.push(stringSelectMenu);
                }

                if (Checker("channelSelectMenu")) {
                    let inside = element.split("{channelSelectMenu:").slice(1).join("").split("}")[0].split(":").map((param) => param?.addBrackets()?.trim());

                    const ID = inside?.shift();
                    const placeholder = inside?.shift();
                    const minValues = inside[0] === "" ? 0 : Number(inside?.shift());
                    const maxValues = inside[0] === "" ? 1 : Number(inside?.shift());
                    const disabled = checkBoolean(inside?.shift(), false);
                    var channelTypes = inside.length !== 0 ? inside?.map((type) => type.addBrackets()).map((type) => !isNaN(Number(type)) ? Number(type) : ctypes[type?.toLowerCase()]) : [];

                    let stringSelectMenu = {
                        type: 8,
                        custom_id: ID,
                        placeholder: placeholder,
                        min_values: minValues,
                        max_values: maxValues,
                        channel_types: channelTypes,
                        disabled,
                    };

                    components.push(stringSelectMenu);
                }

                if (Checker("textInput") || Checker("modalOption")) {
                    let options = Checker("modalOption") ? element.split("{modalOption:").slice(1) : element.split("{textInput:").slice(1);

                    for (var option of options) {
                        option = option.split("}")[0].split(":").map((param) => param?.addBrackets()?.trim());

                        let modalOption = {
                            type: 4
                        };

                        const label = option?.shift();
                        let style = option?.shift();
                        style = isNaN(style) ? style : Number(style);
                        const ID = option?.shift();
                        const required = checkBoolean(option?.shift()) ?? undefined;
                        const placeholder = option?.shift() ?? undefined;
                        const min = option?.shift() ?? undefined;
                        const max = option?.shift() ?? undefined;
                        const defValue = option?.shift() ?? undefined;

                        modalOption.label = label;
                        modalOption.style = Number(style);
                        modalOption.custom_id = ID;
                        modalOption.required = required;
                        modalOption.placeholder = placeholder;
                        modalOption.min_length = parseFloat(min);
                        modalOption.max_length = parseFloat(max);
                        modalOption.value = defValue;

                        console.log(modalOption);

                        components.push(modalOption);
                    };
                }

                rows.push({ type: 1, components: components });
            };

            if (data && data.newMessageData && data.newMessageData.components)
                data.newMessageData.components.push(...rows);
        
            return rows;
        }
        
    },
    OptionParser: {
      name: ["options", "extraOptions"],
      code: async (d, data) => {
        let code = mustEscape(data.part);
        let parserName = "options";

        if (data.Checker(code, "extraOptions"))
          parserName = "extraOptions";

        let options = code.split("{" + parserName + ":").slice(1);

        let Options = {};

        if (data && data.newMessageData && data.newMessageData.options)
            Options = data.newMessageData.options;

        for (var option of options) {
          option = option.slice(0, option.length - 1);

          const Checker = (name) => option.includes(`{${name}:`);
          const CheckerEmpty = (name) => option.includes(`{${name}}`);

          if (Checker("reply") || CheckerEmpty("reply")) {
            const messageID = d.message.id;

            if (Checker("reply"))
                messageID = option.split("{reply:")[1].split("}")[0];

            Options.reply = {
                messageReference: messageID
            };
          }

          if (Checker("reactions")) {
            const reactions = option
              .split("{reactions:")[1]
              .split("}")[0]
              .split(":");

            if (Options && !Options.reactions)
              Options.reactions = [];

            Options.reactions.push(...reactions);
          }

          if (Checker("interaction") || CheckerEmpty("interaction")) {
            const trueorfalse = "true";

            if (data && data.newMessageData && data.newMessageData.options)
                data.newMessageData.options.interaction = checkBoolean(trueorfalse, true);
            else
                Options.interaction = checkBoolean(trueorfalse, true);
          }

          if (Checker("ephemeral") || CheckerEmpty("ephemeral")) {
            const trueorfalse = "true";

            if (data && data.Return)
                data.Return.ephemeral = checkBoolean(trueorfalse, true);
            else
                Options.ephemeral = checkBoolean(trueorfalse, true);
          }

          if (Checker("tts") || CheckerEmpty("tts")) {
            const trueorfalse = "true";

            if (Checker("tts"))
                trueorfalse = option.split("{tts:")[1].split("}")[0];

            if (data && data.Return)
                data.Return.tts = checkBoolean(trueorfalse, true);
            else
                Options.tts = checkBoolean(trueorfalse, true);
          }

          if (Checker("allowedMentions")) {
            let [subname, ...subvalues] = option.split("{allowedMentions:")[1].split("}")[0].addBrackets().split(":");
            subname = subname?.trim()?.toLowerCase();

            if (data.Return) {
                if (!data.Return.allowedMentions)
                    data.Return.allowedMentions = {};
            
                if (subname === "parse") {
                    data.Return.allowedMentions.parse = subvalues;
                } else if (subname === "roles") {
                    data.Return.allowedMentions.roles = subvalues;
                } else if (subname === "users") {
                    data.Return.allowedMentions.users = subvalues;
                }
            } else {
                if (!Options.allowedMentions)
                    Options.allowedMentions = {};
            
                if (subname === "parse") {
                    Options.allowedMentions.parse = subvalues;
                } else if (subname === "roles") {
                    Options.Return.allowedMentions.roles = subvalues;
                } else if (subname === "users") {
                    Options.allowedMentions.users = subvalues;
                }
            };
          }

          if (Checker("deleteCommand") || CheckerEmpty("deleteCommand")) {
            const trueorfalse = "true";

            if (Checker("deleteCommand"))
                trueorfalse = option.split("{deleteCommand:")[1].split("}")[0];

            if (data.newMessageData && data.newMessageData.options)
                data.newMessageData.options.deleteCommand = checkBoolean(trueorfalse, true);
            else
                Options.deleteCommand = checkBoolean(trueorfalse, true);
          }

          if (Checker("fetchReply") || CheckerEmpty("fetchReply")) {
            const trueorfalse = "true";

            if (Checker("fetchReply"))
                trueorfalse = option.split("{fetchReply:")[1].split("}")[0];

            if (data && data.Return)
                data.Return.fetchReply = checkBoolean(trueorfalse, true);
            else
                Options.fetchReply = checkBoolean(trueorfalse, true);
          }

          if (Checker("deleteIn")) {
            const sometime = option.split("{deleteIn:")[1].split("}")[0];

            if (data.newMessageData && data.newMessageData.options)
                data.newMessageData.options.deleteIn = sometime;
            else
                Options.deleteIn = sometime;
          }
        }

        if (data && data.newMessageData)
            data.newMessageData.options = Options;

        return Options;
      },
    },
    FileParser: {
        name: ["file", "attachment"],
        code: async (d, data) => {
            let code = mustEscape(data.part);

            let Files = [];
            
            if (data.Checker(code, "file")) {
                const files = code.split("{file:")?.slice(1)?.map((file) => file?.trim());

                for (let file of files) {
                    var params = file?.split("}")[0]?.split(":");

                    console.log(params);

                    const name = params?.shift()?.addBrackets();
                    const content = params?.join(":")?.addBrackets();

                    const attachment = new Discord.AttachmentBuilder(
                        Buffer.from(content),
                        { name: name }
                    );

                    Files.push(attachment);
                }
            }

            if (data.Checker(code, "attachment")) {
                const attachments = code?.split("{attachment:")?.slice(1).map((attachment) => attachment.trim());

                for (let attach of attachments) {
                    var params = attach?.split("}")[0]?.split(":");

                    console.log(params);

                    const name = params?.shift()?.addBrackets();
                    const content = params?.join(":")?.addBrackets();

                    const attachment = new Discord.AttachmentBuilder(content, { name: name });

                    Files.push(attachment);
                }
            }

            if (data && data.newMessageData && data.newMessageData.files)
                data.newMessageData.files.push(...Files);

            return Files;
        }
    }
  },

  SlashOptionsParser,

  functions: {
    setParser: (parser, newParserObject) => {
      if (parser && typeof parser === "string" && newParserObject)
        module.exports.parsers[parser] = newParserObject;
    },
    deleteParser: (parser) => {
      if (
        parser &&
        typeof parser === "string" &&
        module.exports.parsers[parser]
      )
        delete module.exports.parsers[parser];
    },
  },

  ErrorHandler: async (errorMessage, d, returnMsg = false, channel) => {
    errorMessage = errorMessage.trim();

    const Checker = (theparts, name) => theparts.includes("{" + name + ":");
    const parts = CreateObjectAST(errorMessage);

    let newMessageData = {
      embeds: [],
      components: [],
      files: [],
      options: {},
      suppress: true,
      reply: undefined,
    };

    let Return = {};

    // Running parsers
    for (var part of parts) {
      errorMessage = errorMessage.replace(part, "");

      for (var parser in module.exports.parsers) {
        if (module.exports.parsers[parser]) {
          parser = module.exports.parsers[parser];
          if (!parser.name || !parser.code)
            return console.error("No name/code in parser.");

          const names = Array.isArray(parser.name)
            ? parser.name
            : [parser.name];

          let data = {
            errorMessage,
            returnMsg,
            channel,
            Checker,
            parts,
            parsers: module.exports.parsers,
            part,
            parser,
            newMessageData,
            parserFunctions: module.exports.functions,
            Return
          };

          for (var name of names) {
            if (Checker(part, name)) {
              await parser.code(d, data);
            }
          }
        }
      }
    }

    let send = true;

    // Check stuff
    if (!newMessageData.embeds.length || !newMessageData.suppress) send = false;
    if (returnMsg)
      return {
        content:
          errorMessage.addBrackets() === "" ? " " : errorMessage.addBrackets(),
        embeds: send ? newMessageData.embeds : [],
        components: newMessageData.components,
        files: newMessageData.files,
        options: newMessageData.options,
        reply: newMessageData.reply ? newMessageData.reply : undefined,
        ...Return,
      };

    errorMessage = errorMessage.addBrackets().trim();
    if (!(errorMessage.length || send || newMessageData.files.length)) return;

    const ch = channel || d.channel;

    if (
      (errorMessage.length || send || newMessageData.files.length) &&
      d &&
      ch &&
      !returnMsg
    ) {
      const newMessage = newMessageData.reply
        ? await newMessageData.reply
            .reply({
              content: errorMessage.addBrackets(),
              embeds: send ? newMessageData.embeds : [],
              components: newMessageData.components?.length
                ? newMessageData.components
                : [],
              files: newMessageData.files?.length ? newMessageData.files : [],
              ...Return,
            })
            .catch(console.error)
        : await ch
            .send({
              content: errorMessage.addBrackets(),
              embeds: send ? newMessageData.embeds : [],
              components: newMessageData.components?.length
                ? newMessageData.components
                : [],
              files: newMessageData.files?.length ? newMessageData.files : [],
              ...Return,
            })
            .catch(console.error);

      if (!newMessage) return;

      if (returnMsg === "id") {
        return newMessage.id;
      } else if (returnMsg === "object") {
        return newMessage;
      } else if (returnMsg === "withMessage") return newMessage;
    }
  },
};
