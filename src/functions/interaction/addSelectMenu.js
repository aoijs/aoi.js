const { StringSelectMenuBuilder, UserSelectMenuBuilder, RoleSelectMenuBuilder, MentionableSelectMenuBuilder, ChannelSelectMenuBuilder } = require("discord.js");

module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  const { code } = d.command;
  if (data.err) return d.error(data.err);

  let [ index = 1, type, customId, placeholder, minValues = 1, maxValues = 1, disabled = "false", ...options ] = data.inside.splits;

  index = Number(index) - 1;

  if (isNaN(index) || index < 0) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Index");

  disabled = disabled === "true";
  placeholder = placeholder?.addBrackets();
  customId = customId?.addBrackets();
  minValues = Number(minValues);
  maxValues = Number(maxValues);

  if (!options.length && type === "string") return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Options Are Not Provided In");

  if (minValues > 25 || minValues < 0) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "minValues must be between 0 and 25 (both inclusive).");

  if (maxValues > 25 || maxValues < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "maxValues must be between 1 and 25 (both Inclusive).");

  if (placeholder.length > 100) return d.aoiError.fnError(d, "custom", {}, "Placeholder should be at most 100 Characters long");

  let selectBuilder;

  switch (type.toLowerCase()) {
    case "string":
      selectBuilder = new StringSelectMenuBuilder();
      break;
    case "user":
      selectBuilder = new UserSelectMenuBuilder();
      break;
    case "role":
      selectBuilder = new RoleSelectMenuBuilder();
      break;
    case "mentionable":
      selectBuilder = new MentionableSelectMenuBuilder();
      break;
    case "channel":
      selectBuilder = new ChannelSelectMenuBuilder();
      break;
    default:
      return d.aoiError.fnError(d, "custom",  { inside: data.inside }, "Invalid Select Menu Type");
  }

  selectBuilder
    .setCustomId(customId)
    .setPlaceholder(placeholder)
    .setMaxValues(maxValues)
    .setMinValues(minValues)
    .setDisabled(disabled);

  for (let option of options) {
    option = option.split(":");
    const label = option[0].addBrackets();
    const description = option[1].addBrackets();
    const value = option[2].addBrackets();
    const def = option[3]?.addBrackets() === "true";
    let emoji;

    try {
      emoji = d.util.getEmoji(d, option[4]?.addBrackets()).id;
    } catch {
      emoji = option[4]?.addBrackets() ?? undefined;
    }

    switch (type.toLowerCase()) {
      case "string":
        selectBuilder.addOptions({
          label,
          description,
          value,
          default: def,
          emoji,
        });
        break;
      case "user":
      case "role":
      case "mentionable":
      case "channel":
        selectBuilder.addOption({
          label,
          value,
          type: type.toUpperCase(),
        });
        break;
      default:
        d.aoiError.fnError(d, "custom", { inside: data.inside }, "Select Menu Type");
    }
  }

  d.components[index] = d.components[index] || { type: 1, components: [] };
  d.components[index].components.push(selectBuilder);

  return {
    code: d.util.setCode({ function: d.func, code, inside: data.inside }),
    data: {
      ...d.data,
      components: Object.assign({}, d.data.components, d.components),
    },
    components: d.components,
  };
};
