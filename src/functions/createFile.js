const {AttachmentBuilder} = require('discord.js')
/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [attachment, name] = data.inside.splits;

    const result = new AttachmentBuilder(Buffer.from(attachment.addBrackets()), {name: name.addBrackets()})
    d.files.push(result);

    return {
        code: d.util.setCode(data),
        files: d.files
    }
}