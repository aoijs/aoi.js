const { Time } = require("../core/Time.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID, messageID, userFilter, customIDs, cmds, awaitedCmd, time] = data.inside.splits;

    cmds = cmds.split(",");
    cmds.forEach((x) => {
        if (!(d.client.cmd.interaction.selectMenu.find((y) => y.name?.toLowerCase() === x?.toLowerCase()) || d.client.cmd.interaction.button.find((y) => y.name?.toLowerCase() === x?.toLowerCase()))) {
            return d.aoiError.fnError(d, "custom", {}, "Invalid Interaction Command with the name " + x + " not found");
        }
    });

    customIDs = customIDs.split(",");

    const channel = await d.util.getChannel(d, channelID);
    const message = await d.util.getMessage(channel, messageID);

    const filter = interaction => customIDs.includes(interaction.customId) && (userFilter.includes("everyone") || userFilter.includes(interaction.user.id));
    const collector = message.createMessageComponentCollector({ filter: filter, time: Time.parse(time)?.ms });

    // TODO: allow select menus and others to be collected
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

    if (awaitedCmd) {
        const cmd = d.client.cmd.awaited.find((x) => x.name.toLowerCase() === awaitedCmd.toLowerCase());
        if (!cmd) return d.aoiError.fnError(d, "custom", {}, "Invalid Awaited Command:", awaitedCmd);

        collector.on("end", async () => {
                await d.client.functionManager.interpreter(
                    d.client,
                    d.message,
                    d.args,
                    cmd,
                    d.client.db,
                    false,
                    undefined,
                    d.data,
            );
            
        });
    }

    return {
        code: d.util.setCode(data),
    };
};
