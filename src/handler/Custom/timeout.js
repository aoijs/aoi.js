module.exports = async (d, name, duration, timeoutData, onReady) => {
    let cmds = d.client.cmd?.timeout.V();

    if (onReady) {
        d.client.db.db.on("connect",async () => {
        const datas = await d.client.db.all("__aoijs_vars__", (data) => data.key.startsWith("setTimeout_"));
        if (!datas) return;
        for (const data of datas.filter((x) => {
            return !x.value.__pulseEvery__;
        })) {
            let t = data.value;
            t.__timeoutIds__ = [];
            const dura = t.__duration__ - Date.now();
            cmds = cmds.filter((x) => x.name === t.__timeoutName__);
            if (dura > 0) {
                if (dura > 2147483647) {
                    const interval = setInterval(
                        async () => {
                            if (Date.now() >= t.__duration__) {
                                clearInterval(interval);
                                for (const cmd of cmds) {
                                    await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData: t });
                                }
                                await d.client.db.delete("__aoijs_vars__", data.key);
                            }
                        },
                        1000 * 60 * 60
                    );
                } else {
                    for (const cmd of cmds) {
                        const timeout = setTimeout(async () => {
                            await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData: t });
                            t.__timeoutIds__.push(timeout[Symbol.toPrimitive]());

                            await d.client.db.delete("__aoijs_vars__", data.key);
                        }, dura);
                    }
                }
                d.client.db.set("__aoijs_vars__", "setTimeout", t.__id__, t);
            } else {
                for (const cmd of cmds) {
                    await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData: t });
                }
                await d.client.db.delete("__aoijs_vars__", data.key);
                continue;
            }
        }
        });
    } else {
        timeoutData.__timeoutIds__ = [];
        if (name) {
            cmds = cmds.filter((x) => x.name === name);
        }
        const ids = [];
        for (const cmd of cmds) {
            if (duration > 2147483647) {
                const interval = setInterval(
                    async () => {
                        if (Date.now() >= timeoutData.__duration__) {
                            clearInterval(interval);
                            await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });
                            await d.client.db.delete("__aoijs_vars__", "setTimeout", timeoutData.__id__);
                        }
                    },
                    1000 * 60 * 60
                );
                ids.push(interval[Symbol.toPrimitive]());
            } else {
                const timeout = setTimeout(async () => {
                    await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });

                    ids.splice(ids.indexOf(timeout[Symbol.toPrimitive]()), 1);
                    if (ids.length === 0) {
                        await d.client.db.delete("__aoijs_vars__", "setTimeout", timeoutData.__id__);
                    } else {
                        await d.client.db.set("__aoijs_vars__", "setTimeout", timeoutData.__id__, timeoutData);
                    }
                }, duration);
                ids.push(timeout[Symbol.toPrimitive]());
            }
        }
        timeoutData.__timeoutIds__ = ids;
        await d.client.db.set("__aoijs_vars__", "setTimeout", timeoutData.__id__, timeoutData);
    }
};
