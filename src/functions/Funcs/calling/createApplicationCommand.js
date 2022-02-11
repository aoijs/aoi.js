const parser = require("../../../handler/slashCommandOptionsParser");
const { SlashOptionsParser } = require("../../../handler/parsers.js");
const { SlashTypes } = require("../../../utils/InteractionConstants.js");
module.exports = async (d) => {
  const { code } = d.command;
  const inside = d.unpack();
  const err = d.inside(inside);
  if (err) return d.error(err);

  let [
    guildId,
    name,
    description,
    defaultPermission = "yes",
    type = "slash",
    ...opts
  ] = inside.splits;
  name = name.addBrackets();
  let options;
  let data;
  const guild =
    guildId === "global"
      ? undefined
      : guildId === "custom"
      ? "custom"
      : await d.util.getGuild(d, guildId);
  if (!guild && !["global", "custom"].includes(guildId))
    return d.aoiError.fnError(d, "guild", { inside });
  type = SlashTypes[type] || type;
  if (type === "CHAT_INPUT") {
    if (opts.length) {
      if (opts.length === 1) {
        try {
          options = JSON.parse(opts[0]);
          options = Array.isArray(options) ? options : [options];
        } catch (e) {
          if (opts[0].startsWith("{") && opts[0].endsWith("}"))
            options = await SlashOptionsParser(opts[0] || "");
          else options = await parser(opts);
        }
      } else {
        options = await parser(opts);
      }
    }
  } else {
    description = null;
  }

  if (guild === "custom") {
    data = d.client.interactionManager.applicationData.get(name.toLowerCase());
    if (!data)
      return d.aoiError.fnError(
        d,
        "custom",
        {},
        "No Slash Data Present With Following Keyword: " + name.toLowerCase(),
      );
  } else {
    data = {
      data: {
        name: name,
        type,
        description: description?.addBrackets(),
        defaultPermission: defaultPermission === "yes" || defaultPermission === "true",
        options,
      },
      guildId: guild?.id,
    };
  }
  d.client.application.commands.create(data.data, data.guildId).catch((e) => {
    d.aoiError.fnError(
      d,
      "custom",
      {},
      "Failed To Create Application Command With Reason: " + e,
    );
  });

  return {
    code: d.util.setCode({ function: d.func, code, inside }),
  };
};
