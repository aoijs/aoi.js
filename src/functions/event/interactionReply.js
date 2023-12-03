module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [content = "", embeds = "", components = "", files = "", allowedMentions = "all", ephemeral = "false"] = data.inside.splits;

    const Checker = (theparts, name) => theparts.includes("{" + name + ":");

    embeds = await d.util.parsers.parsers.EmbedParser.code(d, { part: embeds, Checker });

    components = await d.util.parsers.parsers.ComponentParser.code(d, { part: components, Checker });

    files = await d.util.parsers.parsers.FileParser.code(d, { part: files, Checker });

    allowedMentions = allowedMentions === "all" ? [ "everyone", "users", "roles" ] : allowedMentions?.split( "," ) || [];

    await d.data.interaction?.reply({
        content: content.trim() === "" ? " " : content.addBrackets(),
        embeds: embeds,
        components: components,
        files,
        allowedMentions: {
            parse: allowedMentions
        },
        ephemeral: ephemeral === "true" || ephemeral === "true"
    })

    return {
        code: d.util.setCode(data)
    }
        }
