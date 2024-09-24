/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [ name, icon, returnId = "false" ] = data.inside.splits;

    if (!name) return d.aoiError.fnError(d, "custom", { inside: data.inside } ,"Missing Guild Name")
    
    try {
        const guild = await d.client.guilds.create({ name: name.addBrackets(), icon: icon.addBrackets() });

        data.result = returnId === "true" ? guild.id : null;
    } catch (err) {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Failed to create Guild with Reason: " + err)
    }

    return {
        code: d.util.setCode(data)
    }
}