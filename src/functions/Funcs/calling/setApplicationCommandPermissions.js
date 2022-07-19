module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID = "global", id, ...perms] = data.inside.splits;

    let permissions = [];
    if (perms.length === 1) {
        try {
            permissions = JSON.parse(perms);
        } catch {
            const e = perms[0].split(":");
            permissions.push({
                id: e[0],
                type: e[1].toUpperCase(),
                permission: e[2] === "yes",
            });
        }
    } else {
        const e = perms[0].split(":");
        permissions.push({
            id: e[0],
            type: e[1].toUpperCase(),
            permission: e[2] === "yes",
        });
    }

    if (guildID == "global") {
        d.client.application.commands.permissions.set({
            command: id,
            permissions,
        });
    } else {
        d.client.application.commands.permissions.set({
            guild: guildID,
            command: id,
            permissions,
        });
    }

    return {
        code: d.util.setCode(data),
    };
};
