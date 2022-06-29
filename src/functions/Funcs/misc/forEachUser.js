const { wait } = require("../../../utils/helpers/functions.js");
const { Time } = require("../../../utils/helpers/customParser.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [time = "", awaitData, ...cmds] = data.inside.splits;
    const endCmd = cmds.pop();

    try {
        awaitData = JSON.parse(awaitData);
    } catch (e) {
        d.aoiError.fnError(
            d,
            "custom",
            { inside: data.inside },
            "Invalid Data Provided In",
        );
    }

    time = isNaN(time) ? Time.parse(time).ms : Number(time);

    cmds.forEach((x) => {
        if (
            !d.client.cmd.awaited.find(
                (y) => y.name.toLowerCase() === x.toLowerCase(),
            )
        ) {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Awaited Command: " + x + " Not Found",
            );
        }
    });

    cmds = cmds
        .map((x) =>
            d.client.cmd.awaited.find(
                (y) => y.name.toLowerCase() === x.toLowerCase(),
            ),
        )
        .reverse();

    const datas = [...d.client.users.cache.values()].reverse();

    let i = datas.length - 1;

    while (i >= 0) {
        const author = datas[i];

        let u = cmds.length - 1;

        const loopData = {
            channel: d.channel,
            message: d.message,
            guild: d.guild,
            client: d.client,
            author,
            member: d.member,
        };

        while (u >= 0) {
            const cmd = cmds[u];
            await d.interpreter(
                d.client,
                loopData,
                d.args,
                cmd,
                d.client.db,
                false,
                undefined,
                {
                    awaitData,
                },
            );

            u--;
        }

        await wait(time);

        i--;
    }

    if (endCmd !== "") {
        const cmd = d.client.cmd.awaited.find(
            (x) => x.name.toLowerCase() === endCmd.addBrackets().toLowerCase(),
        );
        if (!cmd) return;
        await d.interpreter(
            d.client,
            d.message,
            d.args,
            cmd,
            d.client.db,
            false,
            undefined,
            {
                awaitData,
            },
        );
    }

    return {
        code: d.util.setCode(data),
    };
};
