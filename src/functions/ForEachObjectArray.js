const Interpreter = require("../core/interpreter.js");
/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, property, awaitedCmd, endCmd] = data.inside.splits;

    if (!d.data.objects?.[name]) {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Object With Name '" + name + "' Does Not Exist.");
    }
    
    if (!property) {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Property not found. ");
    }

    let cmd = d.client.cmd.awaited.find((c) => c.name.toLowerCase() === awaitedCmd.toLowerCase());

    if (!cmd) {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Awaited Command With Name '" + awaitedCmd + "' Does Not Exist.");
    }

    let el = {};
    let i = 0;
    for (const key in d.data.objects[name]) {
        if (d.data.objects[name].hasOwnProperty(key)) {

            el[key] = d.data.objects[name][key]; 
            const c = { ...cmd }; 
            c.code = c.code.replaceAll("{value}", el); 

            if(!Array.isArray(el[key])) continue;
            el[key] = d.data.objects[name][key]
            let parsedResult = JSON.stringify(el[property][i])
            await Interpreter(
                d.client,
                d.message,
                d.args,
                c,
                d.client.db,
                true,
                undefined,
                { ...d.data, awaitData: parsedResult, index: i }
            );
            i++;
    }
}

if (endCmd.trim() !== "") {
    const cmd = d.client.cmd.awaited.find((x) => x.name.toLowerCase() === endCmd.addBrackets().toLowerCase());
    if (!cmd) return;
    await d.interpreter(d.client, d.message, d.args, cmd, d.client.db, false, undefined, {
        index: i-1
    });
}

    return {
        code: d.util.setCode(data)
    };
};