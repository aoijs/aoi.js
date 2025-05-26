/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const guildID = data.inside.inside;

    const guild = !!(await d.util.getGuild(d, guildID).catch(() => {
        return false;
    }));  
    
    data.result = guild;

    return {
        code: d.util.setCode(data)
    }
}