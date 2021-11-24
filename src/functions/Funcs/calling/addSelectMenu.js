const {MessageSelectMenu} = require("discord.js");

module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [
        index = 1,
        customId,
        placeHolder,
        minValues = 1,
        maxValues = 1,
        disabled = "no",
        ...options
    ] = inside.splits;
    const components = new MessageSelectMenu();
    index = Number(index) - 1;
    if (isNaN(index) || index < 0)
        d.aoiError.fnError(d, "custom", {inside}, "Invalid Index Provided In");
    disabled = disabled === "yes";
    placeHolder = placeHolder?.addBrackets();
    customId = customId?.addBrackets();
    minValues = Number(minValues);
    maxValues = Number(maxValues);
    if (!options.length)
        d.aoiError.fnError(d, "custom", {inside}, "Options Are Not Provided In");
    if (minValues > 25 || minValues < 0)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside},
            "minValues must be between 0 and 25 (both inclusive). Provided Invalid In",
        );
    if (maxValues > 25 || maxValues < 1)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside},
            "maxValues must be between 1 and 25 (both Inclusive). Provided Invalid In",
        );
    if (placeHolder.length > 100)
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            "Placeholder should be at most 100 char long",
        );
    d.components[index] = d.components[index] || {type: 1, components: []};
    components
        .setCustomId(customId)
        .setPlaceholder(placeHolder)
        .setMaxValues(maxValues)
        .setMinValues(minValues)
        .setDisabled(disabled);
    for (let option of options) {
        option = option.split(":");
        const label = option.shift().addBrackets();
        const description = option.shift().addBrackets();
        const value = option.shift().addBrackets();
        const def = option.shift()?.addBrackets() === "yes";
        const emoji = option.join(":")?.addBrackets();
        components.addOptions({label, description, value, default: def, emoji});
    }
    d.components[index].components.push(components);
    return {
        code: d.util.setCode({function: d.func, code, inside}),
        components: d.components,
    };
};
