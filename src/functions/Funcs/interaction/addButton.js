module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [index, label, style, custom, disabled = "false", emoji] = inside.splits;
    if (isNaN(index) || Number(index) < 1)
        d.aoiError.fnError(d, "custom", {inside}, "Invalid Index Provided In");
    index = Number(index) - 1;
    style = isNaN(style)
        ? d.util.constants.ButtonStyleOptions[style]
        : Number(style);
    disabled = disabled === "true";
    if (!style || style > 5 || style < 1)
        d.aoiError.fnError(d, "custom", {inside}, "Invalid Style Provided In");
    if (!d.components[index]) d.components[index] = {type: 1, components: []};
    const button = {
        label,
        type: 2,
        style,
        disabled,
        emoji,
    };
    button[style === 5 ? "url" : "customId"] = custom;
    d.components[index].components.push(button);
    return {
        code: d.util.setCode({function: d.func, inside, code, result: ""}),
        components: d.components,
    };
};
