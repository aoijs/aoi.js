module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  let [index, label, style, custom, disabled = "false", emoji] = data.inside.splits;

  if (isNaN(index) || Number(index) < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Index Provided In");
 
  index = Number(index) - 1;
  style = isNaN(style) ? d.util.constants.ButtonStyleOptions[style] : Number(style);
  disabled = disabled === "true";

  if (!style || style > 5 || style < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Style Provided In");

  try {
    emoji = d.util.getEmoji(d, emoji.addBrackets()).id;
  } catch {
    emoji = emoji?.addBrackets() ?? undefined;
  }

  const button = {
    label,
    type: 2,
    style,
    disabled,
    emoji,
  };

  button[style === 5 ? "url" : "customId"] = custom;

  if (!d.components[index]) d.components[index] = { type: 1, components: [] };
  d.components[index].components.push(button);

  return {
    code: d.util.setCode(data),
  };
};
