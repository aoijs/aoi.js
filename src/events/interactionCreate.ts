import { GatewayEventNames, Interaction, InteractionTypes, Snowflake } from "aoiluna";
import { AoiClient } from "../structures/AoiClient.js";
import { isAutoFetchDataEnabled } from "../util/DapiHelper.js";
import { AoiClientEvents } from "../typings/enums.js";

export function onInteraction(client: AoiClient) {
    client.client.on(GatewayEventNames.InteractionCreate, async (interaction) => {
        await interactionCreate(interaction, client);
    });
}

export async function interactionCreate(
    interaction: Interaction,
    client: AoiClient,
) {
    const cmdName = getCommandName(interaction);
    if (!cmdName) return;

    const commands = client.managers.commands.interaction.filter(
        (x) => x.name === cmdName,
    );
    if (!commands.size) return;

    for (const cmd of commands.values()) {
        await cmd
            .__compiled__({
                interaction,
                client: client.client,
                bot: client,
                command: cmd,
                message: interaction.message,
                channel:
                    interaction.channel ??
                    client.cache?.channels?.get(interaction.channelId) ??
                    isAutoFetchDataEnabled("channel", client)
                        ? await client.client.getChannel(
                              interaction.channelId as Snowflake,
                        )
                        : { id: interaction.channelId, fetched: false },
                guild:
                    client.cache?.guilds?.get(interaction.guildId) ??
                    isAutoFetchDataEnabled("guild", client)
                        ? await client.client.getGuild(
                              interaction.guildId as Snowflake,
                        )
                        : { id: interaction.guildId, fetched: false },
                author: interaction.user,
                member: interaction.member,
            })
            .catch((e) => {
                if (e.component && !e.success) return;
                else client.emit(AoiClientEvents.Error, e);
            });
    }
}

function getCommandName(interaction: Interaction) {
    switch (interaction.type) {
    case InteractionTypes.ApplicationCommand:
        return interaction.data.name;
    case InteractionTypes.MessageComponent:
        return interaction.customId as string;
    case InteractionTypes.ApplicationCommandAutocomplete:
        return interaction.data.name;
    default:
        return undefined;
    }
}
