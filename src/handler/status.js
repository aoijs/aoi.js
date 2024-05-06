module.exports = async (status, client) => {
    let statuses = client.statuses.V();
    if (statuses.length <= 0) {
        return;
    }

    let y = 0;

    const processStatus = async () => {
        statuses = client.statuses.V();
        if (!statuses[y]) {
            y = 0;
        }

        const stats = {
            activity: statuses[y].activity
        };

        if ((name = stats?.activity?.name)) {
            if (name.includes("$")) {
                stats.activity.name = (await client.functionManager.interpreter(client, {}, [], { code: statuses[y].activity.name }, client.db, true))?.code;
            }
        } else {
            throw new TypeError(`Missing or invalid 'name' method in status[${y}]`);
        }

        client.user.setPresence({
            status: statuses[y].status,
            activities: [stats.activity],
            afk: statuses[y].afk
        });

        setTimeout(processStatus, statuses[y]?.time * 1000 || 0);
        y++;
    };

    await processStatus();
};
