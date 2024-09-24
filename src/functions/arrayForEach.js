const Interpreter = require("../core/interpreter.js");
/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, awaitedCmd, awaitData = "{}", endCmd] = data.inside.splits;

    if (!d.data.arrays?.[name]) {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Array With Name '" + name + "' Does Not Exist.");
    }

    let cmd = d.client.cmd.awaited.find((c) => c.name.toLowerCase() === awaitedCmd.toLowerCase());

    if (!cmd) {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Awaited Command With Name '" + awaitedCmd + "' Does Not Exist.");
    }
    let parsedData;
    try {
        parsedData = JSON.parse(awaitData);
    } catch (e) {
        return d.aoiError.fnError(d, "custom", {}, `Failed To Parse Data With Reason: ${e.message}`);
    }

    let i = 0;
    for (const el of d.arrays[name]) {
        const c = { ...cmd };
        c.code = c.code.replaceAll("{value}", el);
        await Interpreter(d.client, d.message, d.args, c, d.client.db, true, undefined, { ...d.data, awaitData: parsedData, index: i });
        i++;
    }

    if (endCmd.trim() !== "") {
        const cmd = d.client.cmd.awaited.find((x) => x.name.toLowerCase() === endCmd.addBrackets().toLowerCase());
        if (!cmd) return;
        await d.interpreter(d.client, d.message, d.args, cmd, d.client.db, false, undefined, {
            awaitData,
            index: i
        });
    }

    return {
        code: d.util.setCode(data)
    };
};
