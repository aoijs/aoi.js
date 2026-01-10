const MAX_SAFE_TIMEOUT_DURATION = 0x7fffffff;

module.exports = async (d, duration, timeoutData, onReady) => {
    let cmds = d.client.cmd?.timeout.V();

    if (onReady) {
        if (d.client?.db?.db?.readyAt) {
            await handleResidueData(d);
        } else {
            d.client.db.db.once("clientReady", async () => {
                await handleResidueData(d);
            });
        }
        return;
    }

    if (duration > MAX_SAFE_TIMEOUT_DURATION) {
        const interval = setInterval(async () => {
            if (timeoutData.__duration__ > Date.now()) return;

            cmds = cmds.filter((x) => x.name === timeoutData.__timeoutName__);
            for (const cmd of cmds) {
                if (cmd.channel) {
                    const channel = await getChannel(d, cmd.channel);
                    if (!channel) return d.aoiError.fnError(d, "custom", {}, `Invalid channel ID in timeout command: ${cmd.channel}`);
                    await d.interpreter(d.client, { channel }, [], cmd, d.client.db, false, undefined, { timeoutData });
                } else {
                    await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });
                }
            }

            await d.client.db.delete("__aoijs_vars__", `setTimeout_${timeoutData.__id__}`);
            clearInterval(interval);
        }, 3_600_000);

        await d.client.db.set("__aoijs_vars__", "setTimeout", timeoutData.__id__, {
            ...timeoutData,
            __timerID__: interval[Symbol.toPrimitive]()
        });
    } else {
        const timeout = setTimeout(async () => {
            cmds = cmds.filter((x) => x.name === timeoutData.__timeoutName__);
            for (const cmd of cmds) {
                if (cmd.channel) {
                    const channel = await getChannel(d, cmd.channel);
                    if (!channel) return d.aoiError.fnError(d, "custom", {}, `Invalid channel ID in timeout command: ${cmd.channel}`);
                    await d.interpreter(d.client, { channel }, [], cmd, d.client.db, false, undefined, { timeoutData });
                } else {
                    await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });
                }
            }

            await d.client.db.delete("__aoijs_vars__", `setTimeout_${timeoutData.__id__}`);
        }, duration);

        await d.client.db.set("__aoijs_vars__", "setTimeout", timeoutData.__id__, {
            ...timeoutData,
            __timerID__: timeout[Symbol.toPrimitive]()
        });
    }
};

async function handleResidueData(d) {
    const td = await d.client.db.all("__aoijs_vars__", (data) => data.key.startsWith("setTimeout_"));
    let cmds = d.client.cmd?.timeout.V();

    for (const data of td) {
        const timeoutData = data.value;

        if (Date.now() <= timeoutData.__duration__) {
            const remaining = timeoutData.__duration__ - Date.now();

            if (remaining > MAX_SAFE_TIMEOUT_DURATION) {
                const interval = setInterval(async () => {
                    if (timeoutData.__duration__ > Date.now()) return;

                    cmds = cmds.filter((x) => x.name === timeoutData.__timeoutName__);
                    for (const cmd of cmds) {
                        if (cmd.channel) {
                            const channel = await getChannel(d, cmd.channel);
                            if (!channel) return d.aoiError.fnError(d, "custom", {}, `Invalid channel ID in timeout command: ${cmd.channel}`);
                            await d.interpreter(d.client, { channel }, [], cmd, d.client.db, false, undefined, { timeoutData });
                        } else {
                            await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });
                        }
                    }

                    await d.client.db.delete("__aoijs_vars__", `setTimeout_${timeoutData.__id__}`);
                    clearInterval(interval);
                }, 3_600_000);

                await d.client.db.set("__aoijs_vars__", "setTimeout", timeoutData.__id__, {
                    ...timeoutData,
                    __timerID__: interval[Symbol.toPrimitive]()
                });
            } else {
                const timeout = setTimeout(async () => {
                    cmds = cmds.filter((x) => x.name === timeoutData.__timeoutName__);
                    for (const cmd of cmds) {
                        if (cmd.channel) {
                            const channel = await getChannel(d, cmd.channel);
                            if (!channel) return d.aoiError.fnError(d, "custom", {}, `Invalid channel ID in timeout command: ${cmd.channel}`);
                            await d.interpreter(d.client, { channel }, [], cmd, d.client.db, false, undefined, { timeoutData });
                        } else {
                            await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });
                        }
                    }

                    await d.client.db.delete("__aoijs_vars__", `setTimeout_${timeoutData.__id__}`);
                }, remaining);

                await d.client.db.set("__aoijs_vars__", "setTimeout", timeoutData.__id__, {
                    ...timeoutData,
                    __timerID__: timeout[Symbol.toPrimitive]()
                });
            }
        } else {
            cmds = cmds.filter((x) => x.name === timeoutData.__timeoutName__);
            for (const cmd of cmds) {
                if (cmd.channel) {
                    const channel = await getChannel(d, cmd.channel);
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

async function getChannel(d, channel) {
    if (d.util) return await d.util.getChannel(d, channel, true);
    return d.client.channels.cache.get(cmd.channel) || (await d.client.channels.fetch(cmd.channel).catch(() => null));
}
