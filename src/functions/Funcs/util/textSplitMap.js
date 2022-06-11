const Interpreter = require("../../../interpreter.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let commands = data.inside.splits;
    const content = [];

    if (
        commands.some(
            (x) =>
                !d.client.cmd.awaited.find(
                    (y) => y.name.toLowerCase() === x.trim().toLowerCase(),
                ),
        )
    )
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid Awaited Command In",
        );

    for (const a of d.array) {
        for (const command of commands) {
            const cmd = d.client.cmd.awaited.find(
                (y) => y.name.toLowerCase() === command.trim().toLowerCase(),
            );
            if (!cmd) continue;
            else {
                const code = (
                    await Interpreter(d.client, d.message, [a], cmd, d.client.db, true, undefined, {...d.data})
                )?.code;
                content.push(code);
            }
        }
    }

    data.result = content.join("\n");

    return {
        code: d.util.setCode(data),
    };
};
