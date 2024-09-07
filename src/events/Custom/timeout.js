module.exports = async (d, duration, timeoutData, onReady) => {
    let cmds = d.client.cmd?.timeout.V();
    const MAX_SAFE_TIMEOUT_DURATION = 0x7FFFFFFF;

    if (onReady) {
        if (d.client?.db?.db?.readyAt) {
            await handleResidueData(d);
        } else {
            d.client.db.db.on("ready", async () => {
                await handleResidueData(d);
            });
        }
    } else {
        await d.client.db.set("__aoijs_vars__", "setTimeout", timeoutData.__id__, timeoutData);

        if (duration > MAX_SAFE_TIMEOUT_DURATION) {
            const interval = setInterval(
                async () => {
                    if (!(timeoutData.__duration__ <= Date.now())) return;
                    cmds = cmds.filter((x) => x.name === timeoutData.__timeoutName__);
                    for (const cmd of cmds) {
                        if (cmd.channel) {
                            const channel = await d.util.getChannel(d, cmd.channel);
                            if (!channel) return d.aoiError.fnError(d, "custom", {}, `Invalid channel ID in timeout command: ${cmd.channel}`);

                            await d.interpreter(d.client, { channel }, [], cmd, d.client.db, false, undefined, { timeoutData });
                        } else {
                            await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });
                        }
                    }
                    await d.client.db.delete("__aoijs_vars__", `setTimeout_${timeoutData.__id__}`);
                    clearInterval(interval);
                },
                60 * 60 * 1000
            );
        } else {
            setTimeout(async () => {
                cmds = cmds.filter((x) => x.name === timeoutData.__timeoutName__);
                for (const cmd of cmds) {
                    if (cmd.channel) {
                        const channel = await d.util.getChannel(d, cmd.channel);
                        if (!channel) return d.aoiError.fnError(d, "custom", {}, `Invalid channel ID in timeout command: ${cmd.channel}`);

                        await d.interpreter(d.client, { channel }, [], cmd, d.client.db, false, undefined, { timeoutData });
                    } else {
                        await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });
                    }
                }
                await d.client.db.delete("__aoijs_vars__", `setTimeout_${timeoutData.__id__}`);
            }, duration);
        }
    }
};

async function handleResidueData(d) {
    const td = await d.client.db.all("__aoijs_vars__", (data) => data.key.startsWith("setTimeout_"));
    let cmds = d.client.cmd?.timeout.V();
    const MAX_SAFE_TIMEOUT_DURATION = 0x7FFFFFFF;

    for (const data of td) {
        const timeoutData = data.value;
        if (Date.now() <= timeoutData.__duration__) {
            if ((timeoutData.__duration__ - Date.now()) > MAX_SAFE_TIMEOUT_DURATION) {
                const interval = setInterval(
                    async () => {
                        if (!(timeoutData.__duration__ <= Date.now())) return;
                        cmds = cmds.filter((x) => x.name === timeoutData.__timeoutName__);
                        for (const cmd of cmds) {
                            if (cmd.channel) {
                                const channel = await d.util.getChannel(d, cmd.channel);
                                if (!channel) return d.aoiError.fnError(d, "custom", {}, `Invalid channel ID in timeout command: ${cmd.channel}`);

                                await d.interpreter(d.client, { channel }, [], cmd, d.client.db, false, undefined, { timeoutData });
                            } else {
                                await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });
                            }
                        }
                        await d.client.db.delete("__aoijs_vars__", `setTimeout_${timeoutData.__id__}`);
                        clearInterval(interval);
                    },
                    60 * 60 * 1000
                );
            } else {
                setTimeout(async () => {
                    cmds = cmds.filter((x) => x.name === timeoutData.__timeoutName__);
                    for (const cmd of cmds) {
                        if (cmd.channel) {
                            const channel = await d.util.getChannel(d, cmd.channel);
                            if (!channel) return d.aoiError.fnError(d, "custom", {}, `Invalid channel ID in timeout command: ${cmd.channel}`);

                            await d.interpreter(d.client, { channel }, [], cmd, d.client.db, false, undefined, { timeoutData });
                        } else {
                            await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });
                        }
                    }
                    await d.client.db.delete("__aoijs_vars__", `setTimeout_${timeoutData.__id__}`);
                }, timeoutData.__duration__ - Date.now());
            }
        } else {
            cmds = cmds.filter((x) => x.name === timeoutData.__timeoutName__);
            for (const cmd of cmds) {
                if (cmd.channel) {
                    const channel = d.client.channels.cache.get(cmd.channel);
                    if (!channel) return d.aoiError.fnError(d, "custom", {}, `Invalid channel ID in timeout command: ${cmd.channel}`);
                    await d.interpreter(d.client, { channel }, [], cmd, d.client.db, false, undefined, { timeoutData });
                } else {
                    await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });
                }
            }
            await d.client.db.delete("__aoijs_vars__", `setTimeout_${timeoutData.__id__}`);
        }
    }
}
