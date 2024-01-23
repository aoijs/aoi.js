const Discord = require("discord.js");
const chalk = require("chalk");
const SlashOption = require("./slashOption.js");
const { mustEscape } = require("../utils/helpers/mustEscape.js");
const { ButtonStyleOptions } = require("../utils/Constants.js");
const { CreateObjectAST } = require("../utils/helpers/functions.js");
const { deprecate: deprecation } = require("util");

let executed = {};
function deprecate(func, newfunc) {
  if (!executed[func]) {
    deprecation(
      () => {},
      `${chalk.grey(
        func
      )} will be removed in a future version of aoi.js, start using ${chalk.cyan(
        newfunc
      )} instead.`
    )();
    executed[func] = true;
  }
}

const EmbedParser = async (msg, d) => {
  msg = mustEscape(msg);

  const embeds = [];

  let msgs = msg.split("{newEmbed:").slice(1);
  for (let rawr of msgs) {
    rawr = rawr.slice(0, rawr.length - 1);

    const embed = {};
    embed.fields = [];
    const Checker = (peko) => rawr.includes(`{${peko}:`);
    if (Checker("author")) {
      const auth = rawr.split("{author:")[1].split("}")[0].split(":");
      embed.author = {
        name: auth.shift().addBrackets()?.trim() || "",
        icon_url: auth.join(":").addBrackets()?.trim() || "",
      };
    }
    if (Checker("authorURL")) {
      if (!embed.author) return console.error("{author:} was not used");
      embed.author.url = rawr
        .split("{authorURL:")[1]
        .split("}")[0]
        .addBrackets()
        .trim();
    }
    if (Checker("title")) {
      embed.title = rawr.split("{title:")[1].split("}")[0].addBrackets().trim();
    }
    if (Checker("url")) {
      if (!embed.title)
        return console.error("Title was not provided while using {url}");
      embed.url = rawr.split("{url:")[1].split("}")[0].addBrackets().trim();
    }
    if (Checker("description")) {
      embed.description = rawr
        .split("{description:")[1]
        .split("}")[0]
        .addBrackets()
        .trim();
    }
    if (Checker("thumbnail")) {
      embed.thumbnail = {
        url: rawr.split("{thumbnail:")[1].split("}")[0].addBrackets().trim(),
      };
    }
    if (Checker("image")) {
      embed.image = {
        url: rawr.split("{image:")[1].split("}")[0].addBrackets().trim(),
      };
    }
    if (Checker("footer")) {
      const f = rawr.split("{footer:")[1].split("}")[0].split(":");
      embed.footer = {
        text: f.shift().addBrackets().trim() || "",
        icon_url: f.join(":").addBrackets().trim() || "",
      };
    }
    if (Checker("color")) {
      embed.color = Discord.resolveColor(
        rawr.split("{color:")[1].split("}")[0].addBrackets().trim()
      );
    }
    if (rawr.includes("{timestamp")) {
      let t = rawr.split("{timestamp")[1].split("}")[0].replace(":", "").trim();
      if (t === "" || t === "ms") {
        t = Date.now();
      }
      embed.timestamp = new Date(t);
    }
    if (Checker("field")) {
      const fi = rawr.split("{field:").slice(1);
      for (let fo of fi) {
        fo = fo.split("}")[0].split(":");
        const fon = fo.shift().addBrackets().trim();
        const foi = ["yes", "no", "true", "false"].find(
          (x) => x === fo[Number(fo.length - 1)].trim()
        )
          ? fo.pop().trim() === "true"
          : false;

        const fov = fo.join(":").addBrackets().trim();
        embed.fields.push({ name: fon, value: fov, inline: foi });
      }
    }

    embeds.push(embed);
  }
  return embeds;
};

const ComponentParser = async (msg, d) => {
  msg = mustEscape(msg);
  let msgs = msg.split("{actionRow:").slice(1);
  const actionRows = [];

  for (let aoi of msgs) {
    const index = aoi.lastIndexOf("}");
    aoi = aoi.slice(0, index);

    const buttonPart = [];
    const Checker = (checker) => aoi.includes("{" + checker + ":");
    if (Checker("button")) {
      const inside = aoi.split("{button:").slice(1);
      for (let button of inside) {
        button = button?.split("}")[0];
        button = button?.split(":").map((x) => x.trim());

        const label = button.shift().addBrackets();
        let style = isNaN(button[0]) ? button.shift() : Number(button.shift());
        style = ButtonStyleOptions[style] || style;
        const cus = button.shift().addBrackets();
        const disable =
          button.shift()?.replace("true", true)?.replace("false", false) ||
          false;
        let emoji;
        const dInside =
          Number(style) === 5
            ? {
                label: label,
                type: 2,
                style: style,
                url: cus,
                disabled: disable,
              }
            : {
                label: label,
                type: 2,
                style: style,
                custom_id: cus,
                disabled: disable,
              };

        if (button) {
          try {
            emoji = d.util.getEmoji(d, button.toString().addBrackets());
            dInside.emoji = {
              name: emoji.name,
              id: emoji.id,
              animated: emoji.animated,
            };
          } catch {
            emoji = emoji ?? button.toString().addBrackets();
            dInside.emoji = emoji || undefined;
          }
        }
        buttonPart.push(dInside);
      }
    }
    if (Checker("selectMenu")) {
      let inside = aoi.split("{selectMenu:").slice(1).join("");
      inside = inside.split(":").map((c) => c.trim());
      const customID = inside.shift();
      const placeholder = inside.shift();
      const minVal = inside[0] === "" ? 0 : Number(inside.shift());
      const maxVal = inside[0] === "" ? 1 : Number(inside.shift());
      const disabled = inside.shift() === "true";
      const options = inside.join(":").trim();

      const selectMenuTypes = {
        userInput: 5,
        roleInput: 6,
        mentionableInput: 7,
        channelInput: 8,
      };

      let selectMenuOptions = [];

      if (options.includes("{stringInput:")) {
        const opts = options.split("{stringInput:").slice(1);

        for (let opt of opts) {
          opt = opt.split("}")[0].split(":");
          const label = opt.shift();
          const value = opt.shift();
          const desc = opt.shift();
          const def = opt.shift() === "true";
          let emoji;

          const ind = {
            label: label,
            value: value,
            description: desc,
            default: def,
          };

          if (opt) {
            try {
              emoji = d.util.getEmoji(d, opt.toString().addBrackets());
              ind.emoji = {
                name: emoji.name,
                id: emoji.id,
                animated: emoji.animated,
              };
            } catch (e) {
              emoji = emoji ?? opt.toString().addBrackets();
              ind.emoji = emoji || undefined;
            }
          }

          selectMenuOptions.push(ind);
        }
      }

      if (options.includes("{selectMenuOptions:")) {
        deprecate("{selectMenuOptions:}", "{stringInput:}");
        const opts = options.split("{selectMenuOptions:").slice(1);

        for (let opt of opts) {
          opt = opt.split("}")[0].split(":");
          const label = opt.shift();
          const value = opt.shift();
          const desc = opt.shift();
          const def = opt.shift() === "true";
          let emoji;

          const ind = {
            label: label,
            value: value,
            description: desc,
            default: def,
          };

          if (opt) {
            try {
              emoji = d.util.getEmoji(d, opt.toString().addBrackets());
              ind.emoji = {
                name: emoji.name,
                id: emoji.id,
                animated: emoji.animated,
              };
            } catch (e) {
              emoji = emoji ?? opt.toString().addBrackets();
              ind.emoji = emoji || undefined;
            }
          }

          selectMenuOptions.push(ind);
        }
      }

      if (selectMenuOptions.length > 0) {
        buttonPart.push({
          type: 3,
          custom_id: customID,
          placeholder: placeholder,
          min_values: minVal,
          max_values: maxVal,
          disabled,
          options: selectMenuOptions,
        });
      }

      for (const type in selectMenuTypes) {
        if (options.includes(`{${type}}`)) {
          buttonPart.push({
            type: selectMenuTypes[type],
            custom_id: customID,
            placeholder: placeholder,
            min_values: minVal,
            max_values: maxVal,
            disabled,
          });
        }
      }
    }
    if (Checker("textInput")) {
      let inside = aoi.split("{textInput:").slice(1);
      for (let textInput of inside) {
        textInput = textInput.split("}")[0].split(":");
        const label = textInput.shift().addBrackets().trim();
        let style = textInput.shift().addBrackets().trim();
        style = isNaN(style) ? style : Number(style);
        const custom_id = textInput.shift().addBrackets().trim();
        const required = textInput.shift()?.addBrackets().trim() === "true";
        const placeholder = textInput.shift()?.addBrackets().trim();
        const min_length = textInput.shift()?.addBrackets().trim();
        const max_length = textInput.shift()?.addBrackets().trim();
        const value = textInput.shift()?.addBrackets().trim();
        buttonPart.push({
          type: 4,
          label,
          style,
          custom_id,
          required,
          placeholder,
          min_length,
          max_length,
          value,
        });
      }
    }
    actionRows.push({ type: 1, components: buttonPart });
  }
  return actionRows;
};

const FileParser = (msg, d) => {
  if (!msg) return;
  msg = mustEscape(msg);
  const Checker = (ayaya) => msg.includes("{" + ayaya + ":");

  const att = [];
  if (Checker("attachment")) {
    const e = msg
      ?.split("{attachment:")
      ?.slice(1)
      .map((x) => x.trim());
    for (let o of e) {
      o = o.split("}")[0];
      o = o.split(":");

      const attachment = new Discord.AttachmentBuilder(o.pop().addBrackets(), {
        name: o.join(":").toString().addBrackets() ?? "attachment.png",
      });
      att.push(attachment);
    }
  }
  if (Checker("file")) {
    const i = msg
      .split("{file:")
      ?.slice(1)
      .map((x) => x.trim());
    for (let u of i) {
      u = u.split("}")[0];
      u = u.split(":");

      const attachment = new Discord.AttachmentBuilder(
        Buffer.from(u.pop().addBrackets()),
        { name: u.join(":").toString().addBrackets() ?? "file.txt" }
      );
      att.push(attachment);
    }
  }
  return att;
};

const errorHandler = async (errorMessage, d, returnMsg = false, channel) => {
  errorMessage = errorMessage.trim();
  const Checker = (parts, part) => parts.includes("{" + part + ":");
  const specialChecker = (parts, part) =>
    parts.includes("{" + part + "}") || parts.includes("{" + part + ":");

  let send = true;
  let deleteCommand = false;
  let deleteIn;
  let suppress = false;
  let interaction = false,
    ephemeral = false;

  let files = [];
  let reactions = [];
  const embeds = [];
  const components = [];

  let edits = {
    time: "",
    messages: [],
  };

  let reply = {
    message: undefined,
    mention: true,
  };

  const parts = CreateObjectAST(errorMessage);
  for (const part of parts) {
    errorMessage = errorMessage.replace(part, "");
    if (Checker(part, "newEmbed")) embeds.push(...(await EmbedParser(part, d)));
    else if (Checker(part, "actionRow"))
      components.push(...(await ComponentParser(part, d)));
    else if (Checker(part, "attachment") || Checker(part, "file"))
      files = FileParser(part);
    else if (Checker(part, "edit")) edits = await EditParser(part);
    else if (Checker(part, "reply")) {
      let ctn = part.split(":");
      reply = {
        message: ctn[1].trim(),
        mention: ctn[2] ? ctn[2].split("}")[0].trim() === "true" : true,
      };
      if (!ctn[2]) reply.message = ctn[1].split("}")[0].trim();
    } else if (Checker(part, "suppress")) suppress = true;
    else if (Checker(part, "execute")) {
      let cmdname = part.split(":")[1].split("}")[0].trim();
      const cmd = d.client.cmd.awaited.find((x) => x.name === cmdname);
      if (!cmd)
        return console.error(
          `AoiError: Invalid awaited command '${chalk.cyan(
            cmdname
          )}' in ${chalk.grey(`{execute:${cmdname}}`)}`
        );
      await d.interpreter(
        d.client,
        d.message,
        d.args,
        cmd,
        d.client.db,
        false,
        undefined,
        d.data ?? []
      );
    } else if (specialChecker(part, "deleteCommand")) deleteCommand = true;
    else if (specialChecker(part, "interaction")) interaction = true;
    else if (specialChecker(part, "ephemeral")) ephemeral = true;
    else if (Checker(part, "deleteIn")) deleteIn = part.split(":")[1].trim();
    else if (Checker(part, "reactions"))
      reactions = reactionParser(
        part.split(":").slice(1).join(":").replace("}", "")
      );
  }

  if (!embeds.length) send = false;

  if (send && suppress) send = false;

  if (returnMsg === true) {
    return {
      embeds: send ? embeds : [],
      components,
      content:
        errorMessage.addBrackets() === "" ? " " : errorMessage.addBrackets(),
      files,
      options: {
        reply,
        reactions: reactions.length ? reactions : undefined,
        ephemeral,
        suppress,
        interaction,
        edits,
        deleteIn,
        deleteCommand,
      },
    };
  }

  errorMessage = errorMessage.addBrackets().trim();
  if (!(errorMessage.length || send || files.length)) return;

  const ch = channel || d.channel;

  if ((errorMessage.length || send || files.length) && d && ch && !returnMsg) {
    const m = await ch
      .send({
        content: errorMessage.addBrackets(),
        embeds: send ? embeds : [],
        files: files?.length ? files : [],
      })
      .catch(() => {});

    if (!m) return;

    if (m && reactions.length) {
      for (const reaction of reactions) {
        await m.react(reaction).catch(console.error);
      }
    }

    if (m && edits.timeout) {
      for (const code of edits.messages) {
        await new Promise((e) => setTimeout(e, edits.timeout));

        const sender = await errorHandler(d, code, true);

        await m.suppressEmbeds(suppress);

        await m.edit(sender.message, sender.embed).catch(() => null);
      }
    }

    if (m && deleteIn) {
      m.delete({
        timeout: deleteIn,
      }).catch(() => null);
    }

    if (returnMsg === "id") {
      return m.id;
    } else if (returnMsg === "object") {
      return m;
    } else if (returnMsg === "withMessage") return m;
  }
};

const reactionParser = (reactions) => {
  const regex = /(<a?:\w+:[0-9]+>)|\p{Extended_Pictographic}/gu;
  const matches = reactions.match(regex);
  if (!matches) return [];
  return matches;
};

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

const OptionParser = async (options, d) => {
  const Checker = (msg) => options.includes(msg);
  const optionData = {};
  if (Checker("{edit:")) {
    const editPart = options.split("{edit:")[1].split("}}")[0];
    const dur = editPart.split(":")[0];
    const msgs = editPart.split(":{").slice(1).join(":{").split("}:{");
    const messages = [];
    for (const msg of msgs) {
      messages.push(await errorHandler(msg.split("}:{")[0], d));
    }
    optionData.edits = { time: dur, messages };
  }
  if (Checker("{reactions:")) {
    const react = options.split("{reactions:")[1].split("}")[0];
    optionData.reactions = react.split(",").map((x) => x.trim());
  }
  if (Checker("{delete:")) {
    optionData.deleteIn = Time.parse(
      options.split("{delete:")[1].split("}")[0].trim()
    )?.ms;
  }
  if (Checker("{deleteIn:")) {
    optionData.deleteIn = Time.parse(
      options.split("{deleteIn:")[1].split("}")[0].trim()
    )?.ms;
  }
  if (Checker("{deletecommand}")) {
    optionData.deleteCommand = true;
  }
  if (Checker("{interaction}")) {
    optionData.interaction = true;
  }
  return optionData;
};

module.exports = {
  EmbedParser: EmbedParser,
  ComponentParser: ComponentParser,
  FileParser: FileParser,
  ErrorHandler: errorHandler,
  SlashOptionsParser: SlashOptionsParser,
  OptionParser,
};
