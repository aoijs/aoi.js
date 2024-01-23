module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [messageID, userFilter, customIDs, cmds, errorMsg = "", uses = 1, awaitData = ""] = data.inside.splits;

    if (errorMsg?.trim !== "" && errorMsg) {
        errorMsg = await d.util.errorParser(errorMsg, d);
    }
    if (awaitData !== "") {
        try {
            awaitData = JSON.parse(awaitData);
        } catch (e) {
            d.aoiError.fnError(d, "custom", {inside: data.inside}, "Invalid awaitData Provided In");
        }
    }
    cmds = cmds.split(",");
    cmds.forEach((x) => {
        if (
            d.client.cmd.awaited.find((y) => y.name.toLowerCase() === x.toLowerCase())
        ) {
        } else {
            d.aoiError.fnError(d, "custom", {}, "Could not find awaitedCommand " + x);
        }
    });
    customIDs = customIDs.split(",");

    const Component = new d.client.interactionManager.awaitComponents(
        {
            msgId: messageID,
            filter: userFilter,
            customIds: customIDs,
            cmds: cmds,
            errorMessage: errorMsg.awaitData,
            uses: uses,
        },
        d.client,
        awaitData,
    );
    d.client.interactionManager.on("messageComponentInteraction", interact);
    Component.on("AwaitComponent", async (interaction) => {
        const index = cmds[customIDs?.indexOf(interaction.customId)];
        const cmd = d.client.cmd.awaited.find(
            (x) => x.name.toLowerCase() === index.toLowerCase(),
        );
        if (!cmd) return;
        await d.interpreter(
            d.client,
            interaction,
            interaction.message.content?.split(" "),
            cmd,
            d.client.db,
            false,
            undefined,
            {awaitawaitData: Component.awaitData, interaction: interaction},
        );
    });

    //--------------------------------------//
    async function interact(interaction) {
        if (Component.uses <= Component.tries) {
            d.client.interactionManager.removeListener(
                "messageComponentInteraction",
                interact,
            );
        } else
            await Component.await(
                interaction.message.id,
                interaction.user.id,
                interaction.customId,
                interaction,
            );
    }

    return {
        code: d.util.setCode(data),
    };
};