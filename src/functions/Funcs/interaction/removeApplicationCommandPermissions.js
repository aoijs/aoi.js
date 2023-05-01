module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID = "global", id, ...roleoruserID] = data.inside.splits;

    let permissions = {};
    if (roleoruserID.length === 1) {
        try {
            permissions = JSON.parse(roleoruserID);
        } catch {
            const e = roleoruserID[0].split(":");
            permissions[`${e[1].toLowerCase()}s`] = [e[0]];
        }
    } else {
        const e = roleoruserID[0].split(":");
        permissions[`${e[1].toLowerCase()}s`] =
            permissions[`${e[1].toLowerCase()}s`] || [];
        permissions[`${e[1].toLowerCase()}s`].push(e[0]);
    }
    if (guildID === "global") {
        d.client.application.commands.permissions.remove({
            command: id,
            ...permissions,
        });
    } else {
        d.client.application.commands.permissions.remove({
            guild: guildID,
            command: id,
            ...permissions,
        });
    }

    return {
        code: d.util.setCode(data),
    };
};