/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [content, allowedMentions = "all"] = data.inside.splits;

    let parser;

    if (content.includes("$") || d.client.db) {
        console.time("Parser");
        parser = await d.util.errorParser(content, d);
        console.timeEnd("Parser");
    } else {
        parser = {
            content,
            embeds: undefined,
            components: undefined,
            files: undefined,
            data: {}
        };
    }

    const payload = {
        content: parser.content?.trim() === "" ? " " : parser.content?.addBrackets?.() ?? parser.data?.content,
        embeds: parser.embeds ?? parser.data?.embeds,
        components: parser.components ?? parser.data?.components,
        files: parser.files ?? parser.data?.files,
        allowedMentions: {
            parse: allowedMentions === "all"
                ? [ "everyone", "users", "roles" ]
                : allowedMentions
                    ? allowedMentions.split(",").map(s => s.trim())
                    : []
        }
    };

    console.time("EditReply");
    await d.data.interaction?.editReply(payload).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed to Edit Interaction with Reason: " + e);
    });
    console.timeEnd("EditReply");

    return {
        code: d.util.setCode(data)
    };
};
