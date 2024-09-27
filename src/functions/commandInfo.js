/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, option, type] = data.inside.splits;

    let cmd;
    if (type === "default") {
        cmd = d.client.cmd.default.find(x => (x.name.toLowerCase() === name.toLowerCase()) || (Array.isArray(x.aliases) ? x.aliases?.includes(name.toLowerCase()) : (x.aliases?.toLowerCase() === name.toLowerCase())));
    } else if (type === "slash") {
        cmd = d.client.cmd.interaction.slash.find(x => (x.name.toLowerCase() === name.toLowerCase()) || (Array.isArray(x.aliases) ? x.aliases?.includes(name.toLowerCase()) : (x.aliases?.toLowerCase() === name.toLowerCase())));
    } else {
        cmd = d.client.cmd.default.find(x => (x.name.toLowerCase() === name.toLowerCase()) || (Array.isArray(x.aliases) ? x.aliases?.includes(name.toLowerCase()) : (x.aliases?.toLowerCase() === name.toLowerCase()))) || d.client.cmd.interaction.slash.find(x => (x.name.toLowerCase() === name.toLowerCase()) || (Array.isArray(x.aliases) ? x.aliases?.includes(name.toLowerCase()) : (x.aliases?.toLowerCase() === name.toLowerCase())));
    }

    try {
        data.result = eval(`cmd?.${option}`)
    } catch (e) {
        data.result = ""
    }
    return {
        code: d.util.setCode(data),
    }
} 
