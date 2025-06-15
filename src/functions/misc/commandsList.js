module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    const [format = "{name}", sep = ", ", excludeFunctions = "true"] = data.inside.splits;

    const commands = d.client.cmd.default;

    const list = commands
        .filter((cmd) => {
            return excludeFunctions === "true" ? !cmd.name.startsWith("$") : true;
        })
        .map((cmd) => {
            let str = format;
            str = str.replace(/{(.*?)}/g, (_, key) => cmd[key] ?? "unknown");
            str = str.replace(/"(.*?)"/g, (_, key) => cmd[key] ?? "unknown");
            return str;
        });

    if (!Array.from(list.values()).length) {
        data.result = null;
    } else {
        data.result = Array.from(list.values()).join(sep);
    }

    return {
        code: d.util.setCode(data)
    };
};
