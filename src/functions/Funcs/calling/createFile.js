const {MessageAttachment} = require('discord.js')
module.exports = async d => {
    const {code} = d.command
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    let [attachment, name] = inside.splits;
    const result = new MessageAttachment(Buffer.from(attachment.addBrackets()), name.addBrackets())
    d.files.push(result)
    return {
        code: d.util.setCode({function: d.func, code, inside}),
        files: d.files
    }
}