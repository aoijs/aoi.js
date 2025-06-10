const { AttachmentBuilder } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [attachment, name, type = "url", encoding] = data.inside.splits;

    if (type === "buffer") {
        try {
            attachment = Buffer.from(attachment.addBrackets(), encoding);
        } catch (e) {
            return d.aoiError.fnError(d, "custom", {}, e.message);
        }
    } else {
        attachment = attachment.addBrackets();
    }

    const result = new AttachmentBuilder(attachment, { name: name.addBrackets() });
    d.files.push(result);

    return {
        code: d.util.setCode(data),
        files: d.files
    };
};
