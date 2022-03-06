const Discord = require("discord.js");
const Util = require("../classes/Util.js");
const interpreter = require("../interpreter.js");

const { mustEscape } = require("../utils/helpers/mustEscape.js");
const { ButtonStyleOptions } = require("../utils/Constants.js");
const SlashOption = require("./slashOption.js");
const { Time } = require("../utils/helpers/customParser.js");
const EmbedParser = async (msg) => {
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
      embed.color = Discord.Util.resolveColor(
        rawr.split("{color:")[1].split("}")[0].addBrackets().trim(),
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
          (x) => x === fo[Number(fo.length - 1)].trim(),
        )
          ? fo.pop().trim() === "yes"
          : false;

        const fov = fo.join(":").addBrackets().trim();
        embed.fields.push({ name: fon, value: fov, inline: foi });
      }
    }
    if (Checker("fields")) {
      const fie = rawr.split("{fields:").slice(1);
      for (let fiel of fie) {
        fiel = fiel.split("}")[0].split(":");
        for (let oof of fiel) {
          oof = oof.split(",");
          const oofn = oof.shift().addBrackets().trim();
          const oofi = ["yes", "no", "true", "false"].find(
            (x) => x === oof[oof.length - 1].trim(),
          )
            ? oof.pop().trim() === "yes"
            : false;
          const oofv = oof.join(",").addBrackets().trim();
          embed.fields.push({ name: oofn, value: oofv, inline: oofi });
        }
      }
    }
    embeds.push(embed);
  }
  return embeds;
};
const ComponentParser = async (msg, client) => {
  let components;
  msg = mustEscape(msg);
  let msgs = msg.split("{actionRow:").slice(1);
  const actionRows = [];
  for (let nya of msgs) {
    const index = nya.lastIndexOf("}");
    nya = nya.slice(0, index);

    const buttonPart = [];
    const Checker = (neko) => nya.includes("{" + neko + ":");
    if (Checker("button")) {
      const inside = nya.split("{button:").slice(1);
      for (let button of inside) {
        button = button?.split("}")[0];
        button = button?.split(":").map((x) => x.trim());

        const label = button.shift().addBrackets();
        const btype = 2;
        let style = isNaN(button[0]) ? button.shift() : Number(button.shift());
        style = ButtonStyleOptions[style] || style;
        const cus = button.shift().addBrackets();
        const disable =
          button
            .shift()
            ?.replace("yes", true)
            ?.replace("no", false)
            ?.replace("true", true)
            ?.replace("false", false) || false;
        const emoji = button.length
          ? (button || []).join(":").trim().startsWith("<")
            ? client.emojis.cache.find((x) => x.toString() === button.join(":"))
            : {
                name: button.join(":").split(",")[0],
                id: button.join(":").split(",")[1] || 0,
                animated: button.join(":").split(",")[2] || false,
              }
          : undefined;
        const d =
          Number(style) === 5
            ? {
                label: label,
                type: btype,
                style: style,
                url: cus,
                disabled: disable,
              }
            : {
                label: label,
                type: btype,
                style: style,
                custom_id: cus,
                disabled: disable,
              };
        if (emoji) {
          const en = emoji?.name;
          const eid = emoji?.id;
          const ea = emoji?.animated;
          d.emoji = { name: en, id: eid, animated: ea };
        }
        buttonPart.push(d);
      }
    }
    if (Checker("selectMenu")) {
      const selectMenu = [];
      let inside = nya.split("{selectMenu:").slice(1).join("");
      inside = inside.split(":").map((c) => c.trim());
      const customID = inside.shift();
      const placeholder = inside.shift();
      const minVal = inside[0] === "" ? 0 : Number(inside.shift());
      const maxVal = inside[0] === "" ? 1 : Number(inside.shift());
      const disabled = inside.shift() === "yes";
      const options = inside.join(":").trim();

      let optArray = [];
      if (options.includes("{selectMenuOptions:")) {
        const opts = options.split("{selectMenuOptions:").slice(1);

        for (let opt of opts) {
          opt = opt.split("}")[0].split(":");
          const label = opt.shift();
          const value = opt.shift();
          const desc = opt.shift();
          const def = opt.shift() === "yes";
          const emoji = opt.length
            ? (opt || "").join(":").trim().startsWith("<")
              ? client.emojis.cache.find((x) => x.toString() === opt.join(":"))
              : {
                  name: opt.join(":").split(",")[0].trim(),
                  id: opt.join(":").split(",")[1]?.trim() || 0,
                  animated: opt.join(":").split(",")[2]?.trim() || false,
                }
            : undefined;
          const ind = {
            label: label,
            value: value,
            description: desc,
            default: def,
          };
          if (emoji) {
            const en = emoji?.name;
            const eid = emoji?.id;
            const ea = emoji?.animated;
            ind.emoji = { name: en, id: eid, animated: ea };
          }

          optArray.push(ind);
        }
      }
      buttonPart.push({
        type: 3,
        custom_id: customID,
        placeholder: placeholder,
        min_values: minVal,
        max_values: maxVal,
        disabled,
        options: optArray,
      });
    }
    actionRows.push({ type: 1, components: buttonPart });
  }
  return actionRows;
};
const FileParser = (msg) => {
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
      const name = o.pop().addBrackets();
      const url = o.join(":").addBrackets();
      const attachment = new Discord.MessageAttachment(url, name);
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
      const name = u.pop().addBrackets();
      const text = u.join(":").addBrackets();
      const attachment = new Discord.MessageAttachment(
        Buffer.from(text),
        name || "txt.txt",
      );
      att.push(attachment);
    }
  }
  return att;
};
const errorHandler = async (d, errorMessage, returnMsg = false, channel) => {
  errorMessage = errorMessage.trim();
  const embeds = [];
  let deleteCommand = false;
  let send = true;
  let interaction;
  let deleteAfter;

  let suppress = false;
  let files = [];
  let reactions = [];

  let edits = {
    time: "0s",
    messages: [],
  };
  if (errorMessage.includes("{edit:")) {
    const editPart = errorMessage.split("{edit:")[1].split("}}")[0];
    const dur = editPart.split(":")[0];
    const msgs = editPart.split(":{").slice(1).join(":{").split("}:{");
    const messages = [];
    for (const msg of msgs) {
      messages.push(await Util.errorParser(msg.split("}:{")[0], d));
    }
    edits = { time: dur, messages };

    errorMessage = errorMessage.replace(`{edit:${editPart}}}`, "");
  }

  if (errorMessage.includes("{file:")) {
    for (const after of errorMessage.split("{file:").slice(1)) {
      const inside = after.split("}")[0];
      const fields = inside.split(":");
      const name = fields.pop().addBrackets().trim();
      const text = fields.join(":").addBrackets().trim();
      files.push(new Discord.MessageAttachment(Buffer.from(text), name));
      errorMessage = errorMessage.replace(`{file:${inside}}`, "");
    }
  }
  if (errorMessage.includes("{suppress:")) {
    const inside = errorMessage.split("{suppress:")[1].split("}")[0].trim();

    suppress = inside === "yes";

    errorMessage = errorMessage.replace(`{suppress:${inside}}`, "");
  }
  if (errorMessage.includes("{interaction:")) {
    const inside = errorMessage.split("{interaction:")[1].split("}")[0].trim();

    interaction = inside === "yes";

    errorMessage = errorMessage.replace(`{interaction:${inside}}`, "");
  }

  if (errorMessage.includes("{attachment:")) {
    for (const after of errorMessage.split("{attachment:").slice(1)) {
      const inside = after.split("}")[0];
      let [name, ...url] = inside.split(":");
      name = name.addBrackets().trim();
      url = url.join(":").addBrackets().trim();
      const attachment = new Discord.MessageAttachment(url, name);
      files.push(attachment);
      errorMessage = errorMessage.replace(`{attachment:${inside}}`, "");
    }
  }

  if (errorMessage.includes("{deletecommand}")) {
    deleteCommand = true;
    errorMessage = errorMessage.replace(`{deletecommand}`, "");
  }
  if (errorMessage.includes("{delete:")) {
    const inside = errorMessage.split("{delete:")[1].split("}")[0].trim();

    deleteAfter = Time.parse(inside)?.ms;

    errorMessage = errorMessage.replace(`{delete:${inside}}`, "");
  }

  if (errorMessage.includes("{execute:")) {
    const command = errorMessage.split("{execute:")[1].split("}")[0];
    errorMessage = errorMessage.replace(`{execute:${command}}`, "");
    const cmd = d.client.cmd.awaited.find((c) => c.name === command);
    if (!cmd)
      return d.error(
        `:x: Invalid awaited command '${command}' in {execute:${command}}`,
      );
    await d.interpreter(d.client, d.message, d.args, cmd);
  }
  if (errorMessage.includes("{newEmbed:")) {
    const o = errorMessage.split("{newEmbed:").slice(1);
    for (let errorMessages of o) {
      const index = errorMessages.lastIndexOf("}");
      errorMessages = errorMessages.slice(0, index);
      const old = errorMessages;

      const embed = new Discord.MessageEmbed();
      if (errorMessages.includes("{title:")) {
        const inside = errorMessages.split("{title:")[1].split("}")[0];
        embed.setTitle(inside.addBrackets().trim());
        errorMessages = errorMessages.replace(`{title:${inside}}`, "");
      }

      if (errorMessages.includes("{url:")) {
        const url = errorMessages.split("{url:")[1].split("}")[0].trim();

        if (embed.title) embed.setURL(url.addBrackets());

        errorMessages = errorMessages.replace(`{url:${url}}`, "");
      }

      if (errorMessages.includes("{timestamp")) {
        const rest = errorMessages.includes("{timestamp:")
          ? errorMessages.split("{timestamp:")[1].split("}")[0]
          : "";

        embed.setTimestamp(Number(rest.trim()) || Date.now());

        errorMessages = errorMessages.replace(
          `{timestamp${rest ? ":" + rest : ""}}`,
          "",
        );
      }

      if (errorMessages.includes("{author:")) {
        const inside = errorMessages
          .split("{author:")[1]
          .split("}")[0]
          .split(":");
        let to = inside.join(":");
        const text = inside.shift().trim();
        const url = inside.join(":").trim();
        embed.setAuthor({
          name: text.addBrackets(),
          iconURL: typeof url === "string" ? url.addBrackets() : undefined,
        });
        errorMessages = errorMessages.replace(`{author:${to}}`, "");
      }
      if (errorMessages.includes("{authorURL:")) {
        const inside = errorMessages
          .split("{authorURL:")[1]
          .split("}")[0]
          .trim();
        if (embed.author) embed.author.url = inside;
        errorMessages = errorMessages.replace(`{authorURL:${inside}}`, "");
      }
      if (errorMessages.includes("{fields:")) {
        const inside = errorMessages.split("{fields:").slice(1);
        for (let o of inside) {
          o = o.split("}")[0].split(":");
          for (let i of o) {
            i = i.split(",");
            const ifn = i.shift().trim();
            const ifi = ["yes", "no", true, false].find(
              (x) => x == i[i.length - 1].trim(),
            )
              ? i.pop().trim() === "yes"
              : false;
            const ifv = i.join(",").trim();

            embed.addField(ifn, ifv, ifi);
          }
        }
        errorMessages = errorMessages.replace(`{fields:${inside}}`, "");
      }
      if (errorMessages.includes("{footer:")) {
        const inside = errorMessages
          .split("{footer:")[1]
          .split("}")[0]
          .split(":");
        let to = inside.join(":");
        const text = inside.shift();
        const url = inside.join(":");
        embed.setFooter({
          text: text.addBrackets().trim(),
          iconURL:
            typeof url === "string" ? url.addBrackets().trim() : undefined,
        });
        errorMessages = errorMessages.replace(`{footer:${to}}`, "");
      }

      if (errorMessages.includes("{description:")) {
        const inside = errorMessages
          .split("{description:")[1]
          .split("}")[0]
          .trim();
        embed.setDescription(inside.addBrackets());
        errorMessages = errorMessages.replace(`{description:${inside}}`, "");
      }

      if (errorMessages.includes("{color:")) {
        const inside = errorMessages.split("{color:")[1].split("}")[0].trim();
        embed.setColor(inside.addBrackets());
        errorMessages = errorMessages.replace(`{color:${inside}}`, "");
      }

      if (errorMessages.includes("{thumbnail:")) {
        const inside = errorMessages
          .split("{thumbnail:")[1]
          .split("}")[0]
          .trim();
        embed.setThumbnail(inside.addBrackets());
        errorMessages = errorMessages.replace(`{thumbnail:${inside}}`, "");
      }

      if (errorMessages.includes("{field:")) {
        const fields = errorMessages.split("{field:");
        fields.shift();
        for (const after of fields) {
          const inside = after.split("}")[0].split(":");
          let inline = false;
          let arg;
          if (
            inside.length > 2 &&
            ["yes", "no"].some((w) => inside[inside.length - 1].trim() === w)
          ) {
            arg = inside.pop().trim();
            inline = arg === "yes";
          }
          embed.addField(
            inside[0].addBrackets().trim(),
            inside.slice(1).join(":").addBrackets().trim(),
            inline,
          );
          errorMessages = errorMessages.replace(
            `{field:${inside.join(":")}${arg ? `:${arg}` : ""}}`,
            "",
          );
        }
      }

      if (errorMessages.includes("{image:")) {
        const inside = errorMessages.split("{image:")[1].split("}")[0].trim();
        embed.setImage(inside.addBrackets());
        errorMessages = errorMessages.replace(`{image:${inside}}`, "");
      }
      errorMessage = errorMessage.replace("{newEmbed:" + old + "}", "");

      embeds.push(embed);
    }
  }
  if (errorMessage.includes("{reactions:")) {
    const react = errorMessage.split("{reactions:")[1].split("}")[0];
    reactions = react.split(":").map((x) => x.trim());
    errorMessage = errorMessage.replace(`{reactions:${react}}`, "");
  }

  if (!embeds.length) send = false;

  if (send && suppress) send = false;

  if (returnMsg === true) {
    return {
      embeds: send ? embeds : [],
      content:
        errorMessage.addBrackets() === "" ? " " : errorMessage.addBrackets(),
      options: {
        reactions: reactions.length ? reactions : undefined,
        suppress,
        edits,
        deleteIn: deleteAfter,
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
      .catch((Err) => {});

    if (!m) return;

    if (m && reactions.length) {
      for (const reaction of reactions) {
        await m.react(reaction).catch((err) => {});
      }
    }

    if (m && edits.timeout) {
      for (const code of edits.messages) {
        await new Promise((e) => setTimeout(e, edits.timeout));

        const sender = await errorHandler(d, code, true);

        await m.suppressEmbeds(suppress);

        await m.edit(sender.message, sender.embed).catch((err) => null);
      }
    }

    if (m && deleteAfter) {
      m.delete({
        timeout: deleteAfter,
      }).catch((err) => null);
    }

    if (returnMsg === "id") {
      return m.id;
    } else if (returnMsg === "object") {
      return m;
    } else if (returnMsg === "withMessage") return m;
  }
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
      messages.push(await Util.errorParser(msg.split("}:{")[0], d));
    }
    optionData.edits = { time: dur, messages };
  }
  if (Checker("{reactions:")) {
    const react = options.split("{reactions:")[1].split("}")[0];
    optionData.reactions = react.split(":").map((x) => x.trim());
  }
  if (Checker("{delete:")) {
    optionData.deleteIn = Time.parse(
      options.split("{delete:")[1].split("}")[0].trim(),
    )?.ms;
  }
  if (Checker("deletecommand")) {
    optionData.deleteCommand = true;
  }
  if (Checker("interaction")) {
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
/*Copyright © 2021 @Akarui Development*/
