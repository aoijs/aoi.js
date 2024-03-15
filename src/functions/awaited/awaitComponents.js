const { Time } = require("../../utils/helpers/customParser.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID, messageID, userFilter, customIDs, cmds, errorMsg = "", uses = 1, time] = data.inside.splits;

    cmds = cmds.split(",");
    cmds.forEach((x) => {
        if (!(d.client.cmd.interaction.selectMenu.find((y) => y.name?.toLowerCase() === x?.toLowerCase()) || d.client.cmd.interaction.button.find((y) => y.name?.toLowerCase() === x?.toLowerCase()))) {
            return d.aoiError.fnError(d, "custom", {}, "awaitedCommand " + x);
        }
    });

    customIDs = customIDs.split(",");

    const channel = await d.util.getChannel(d, channelID);
    const message = await d.util.getMessage(channel, messageID);

    const filter = interaction => customIDs.includes(interaction.customId) && (userFilter.includes("everyone") || userFilter.includes(m.user.id));
    const collector = message.createMessageComponentCollector({ filter: filter, max: uses, time: Time.parse(time)?.ms });

    collector.on("collect", async (interaction) => {
        const index = cmds[customIDs?.indexOf(interaction.customId)];
        const cmd = d.client.cmd.interaction.selectMenu.find((y) => y.name?.toLowerCase() === index?.toLowerCase()) || d.client.cmd.interaction.button.find((y) => y.name?.toLowerCase() === index?.toLowerCase())
        if (!cmd) return;

        await d.interpreter(
            d.client,
            interaction,
            interaction.message.content?.split(" "),
            cmd,
            d.client.db,
            false,
            undefined,
            { interaction: interaction },
        );
    });

    if (errorMsg?.trim !== "" && errorMsg) {
        errorMsg = await d.util.errorParser(errorMsg, d);

        collector.on("end", async (collected) => {
            if (collected.size < Number(uses)) {
                await d.aoiError.makeMessageError(
                    d.client,
                    channel,
                    errorMsg.data ?? errorMsg,
                    errorMsg.options,
                    d
                );
            }
        });
    }

    return {
        code: d.util.setCode(data),
    };
};