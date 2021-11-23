module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [index, ...fields] = inside.splits;
    index = Number(index) - 1;
    if (isNaN(index) || index < 0)
        d.aoiError.fnError(d, "custom", {inside}, "Invalid Index Provided In");
    let data = [];
    for (const field of fields) {
        let [name, value, inline = "no"] = field.split(":");
        name = name.addBrackets();
        value = value.addBrackets();
        inline = inline === "yes" || inline === "true";
        data.push({name, value, inline});
    }
    if (!d.embeds[index]) d.embeds[index] = new d.embed();
    d.embeds[index].addFields(data);

    return {
        code: d.util.setCode({function: d.func, inside, code, result: ""}),
        embeds: d.embeds,
    };
};
