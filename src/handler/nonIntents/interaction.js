const {
    Interaction,
    ButtonInteraction,
    SelectMenuInteraction,
    ContextMenuInteraction,
    CommandInteraction
} = require("discord.js");
const Interpreter = require("../../interpreter.js");
const {
    InteractionTypes,
    MessageComponentTypes,
} = require("../../utils/InteractionConstants.js");
/**
 * @param  {Interaction | ButtonInteraction | SelectMenuInteraction | ContextMenuInteraction | CommandInteraction } interaction
 * @param  {import('../../classes/Bot.js')} client
 */
module.exports = async (interaction, client) => {
    client.interactionManager.resolve(interaction);
    if (interaction.isMessageComponent()) {
        client.interactionManager.emit("messageComponentInteraction", interaction);
    }

    let cmds;
    if (InteractionTypes[interaction.type] === "component") {
        cmds = client.cmd.interaction[
            MessageComponentTypes[interaction.componentType]
            ]
            .filter((x) =>
                x.name
                    ? Array.isArray(x.name)
                        ? x.name.includes(interaction.customId)
                        : x.name === interaction.customId
                    : !x.name,
            )
            .allValues();
    } else {
        cmds = client.cmd.interaction.slash
            .filter(
                (x) => x.name.toLowerCase() === interaction.commandName.toLowerCase(),
            )
            .allValues();
    }

    if (!cmds.length) return;
    const data = {
        client: client,
        guild: interaction.guild,
        message: interaction?.message,
        channel: interaction.channel,
        author: interaction.author,
        member: interaction.member,
    };
    for (const cmd of cmds) {
        await Interpreter(
            client,
            data,
            [],
            cmd,
            client.db,
            false,
            undefined,
            {interaction: interaction},
            undefined,
        );
    }
};
