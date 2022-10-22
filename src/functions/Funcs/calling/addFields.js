module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [...fields] = data.inside.splits;
    let index = 0;

    if (!isNaN(fields[0]) || !(Number(fields[0]) < 0))
        index = Number(fields.shift());

    let datas = [];

    for (const field of fields) {
        let [name, value, inline = "no"] = field.split(":");

        name = name.addBrackets();
        value = value.addBrackets();
        inline = inline === "yes" || inline === "true";

        datas.push({ name, value, inline });
    }

    if (!d.embeds[index]) d.embeds[index] = new d.embed();

    d.embeds[index].addFields(datas);

    return {
        code: d.util.setCode(data),
        embeds: d.embeds,
    };
};
