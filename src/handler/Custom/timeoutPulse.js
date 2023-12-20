module.exports = async (d, name, duration, pulse, timeoutData, onReady) => {
    let cmds = d.client.cmd.pulse.allValues();

    if (onReady) {
        const datas = await d.client.db.all("__aoijs_vars__", (data) =>
            data.key.startsWith("setTimeout_"),
        );
        for (const data of datas.filter((x) => x.value?.__pulseEvery__)) {
            let t = data.value;

            t.__timeoutIds__ = [];
            t.__pulseIds__ = [];
            cmds = cmds.filter((x) => x.name === t.__timeoutName__);

            if (t.__duration__ - Date.now() > 0) {
                for (const cmd of cmds) {
                    const interval = setInterval(async () => {
                        await d.interpreter(
                            d.client,
                            {},
                            [],
                            cmd,
                            d.client.db,
                            false,
                            undefined,
                            { timeoutData: t },
                        );
                    }, t.__pulseEvery__);

                    t.__pulseIds__.push(interval[Symbol.toPrimitive()]());

                    const timeout = setTimeout(async () => {
                        clearInterval(interval);
                        await d.client.db.delete("__aoijs_vars__", data.key);
                    }, t.__duration__ - Date.now());

                    t.__timeoutIds__.push(timeout[Symbol.toPrimitive()]());
                }
                d.client.db.set("__aoijs_vars__", "setTimeout", t.__id__, t);
            } else {
                await d.client.db
                    .delete("__aoijs_vars__", data.key)
                    .catch(console.error);
            }
        }
    } else {
        if (name) {
            cmds = cmds.filter((x) => x.name === name);
        }

        timeoutData.__timeoutIds__ = [];
        timeoutData.__pulseIds__ = [];

        for (const cmd of cmds) {
            const interval = setInterval(() => {
                d.interpreter(
                    d.client,
                    {},
                    [],
                    cmd,
                    d.client.db,
                    false,
                    undefined,
                    {
                        timeoutData,
                    },
                );
            }, pulse || duration);

            timeoutData.__pulseIds__.push(interval[Symbol.toPrimitive()]());

            const timeout = setTimeout(async () => {
                clearInterval(interval);

                const ids = timeoutData.__timeoutIds__;
                ids.splice(ids.indexOf(timeout[Symbol.toPrimitive]()), 1);

                if (ids.length === 0)
                    await d.client.db.delete(
                        "__aoijs_vars__",
                        timeoutData.__id__,
                    );
                else
                    await d.client.db.set(
                        "__aoijs_vars__",
                        "setTimeout",
                        timeoutData.__id__,
                        timeoutData,
                    );
            }, duration);

            timeoutData.__timeoutIds__.push(timeout[Symbol.toPrimitive()]());
        }

        d.client.db.set(
            "__aoijs_vars__",
            "setTimeout",
            timeoutData.__id__,
            timeoutData,
        );
    }
};
