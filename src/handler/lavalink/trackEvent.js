/**
 *
 * @param {import("leref.ts").LerefTracking} track
 * @param {import("leref.ts").LerefPlayer} player
 * @param {import("../../classes/Lavalink")} lava
 * @param {{name: string, code: string, channel: string}[]} commands
 * @param reason
 */
module.exports = async (commands, track, player, lava, reason) => {
    /** @type {import("discord.js").GuildMember} */
    const member = track.requester;
    const client = member.client;
    let chan;
    let data = {
        guild: member.guild,
        channel: player.text,
        author: member.user,
        member,
        client,
    };
    if (reason) data["array"] = [reason];
    for (const cmd of commands) {
        const id = cmd.channel.includes("$")
            ? (
                await client.functionManager.interpreter(
                    client,
                    data,
                    [],
                    {
                        name: "ChannelParser",
                        code: cmd.channel,
                        functions: client.functionManager.findFunctions(cmd.channel),
                    },
                    client.db,
                    true,
                )
            )?.code
            : cmd.channel;
        chan = client.channels.cache.get(id);
        await client.functionManager.interpreter(
            client,
            data,
            [],
            cmd,
            client.db,
            false,
            chan?.id,
            {track},
            chan,
        );
    }
};
