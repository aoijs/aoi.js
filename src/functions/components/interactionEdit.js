const { MessageFlags } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [content, allowedMentions = "all"] = data.inside.splits;

    const parser = await d.util.errorParser(content, d);

    await d.data.interaction
        ?.editReply({
            content: parser.flags & MessageFlags.IsComponentsV2 ? null : parser.content,
            embeds: parser.embeds,
            components: parser.components,
            files: parser.files,
            flags: parser.flags ?? 0,
            allowedMentions: {
                parse: allowedMentions === "all" ? ["everyone", "users", "roles"] : allowedMentions ? allowedMentions?.split(",") : []
            }
        })
        .catch((e) => {
            d.aoiError.fnError(d, "custom", {}, "Failed to Edit Interaction with Reason: " + e);
        });

    return {
        code: d.util.setCode(data)
    };
};
