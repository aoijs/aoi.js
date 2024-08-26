const { wait } = require("../core/functions.js");
const { Time } = require("../core/Time.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [time = "", awaitData, ...cmds] = data.inside.splits;
    const endCmd = cmds.pop();

    try {
        awaitData = JSON.parse(awaitData);
    } catch (e) {
        d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Data Provided In");
    }

    time = isNaN(time) ? Time.parse(time).ms : Number(time);

    cmds.forEach((x) => {
        if (!d.client.cmd.awaited.find((y) => y.name.toLowerCase() === x.toLowerCase())) {
            d.aoiError.fnError(d, "custom", {}, "Awaited Command: " + x + " Not Found");
        }
    });

    cmds = cmds.map((x) => d.client.cmd.awaited.find((y) => y.name.toLowerCase() === x.toLowerCase())).reverse();

    const channels = [...d.client.channels.cache.values()].reverse();

    let i = channels.length - 1;

    while (i >= 0) {
        const channel = channels[i];

        let u = cmds.length - 1;

        const loopData = {
            channel,
            message: d.message,
            guild: channel.guild,
            client: d.client,
            author: d.author,
            member: d.member
        };

        while (u >= 0) {
            const cmd = cmds[u];
            await d.interpreter(d.client, loopData, d.args, cmd, d.client.db, false, undefined, {
                awaitData,
                index: i
            });

            u--;
        }

        await wait(time);

        i--;
    }

    if (endCmd !== "") {
        const cmd = d.client.cmd.awaited.find((x) => x.name.toLowerCase() === endCmd.addBrackets().toLowerCase());
        if (!cmd) return;
        await d.interpreter(d.client, d.message, d.args, cmd, d.client.db, false, undefined, {
            awaitData
        });
    }

    return {
        code: d.util.setCode(data)
    };
};
