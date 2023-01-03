const {AttachmentBuilder} = require('discord.js')
module.exports = async d => {
    const {code} = d.command
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    let [attachment, name] = inside.splits;
    const result = new AttachmentBuilder(Buffer.from(attachment.addBrackets()), { name : name.addBrackets()})
    d.files.push(result)
    return {
        code: d.util.setCode({function: d.func, code, inside}),
        files: d.files
    }
}