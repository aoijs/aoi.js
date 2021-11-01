module.exports = async (d, name, duration, timeoutData, onReady) => {
    let cmds = d.client.cmd.timeout.allValues();

    if (onReady) {
        const datas = await d.client.db.all(d.client.db.tables[0], x => x.key.startsWith('setTimeout'));
        for (const data of datas.filter(x => !x.data.value.__pulseEvery__)) {
            const t = data.data.value;
            const dura =t.__duration__ - Date.now();
            cmds = cmds.filter(x => x.name === t.__timeoutName__);
            if ((dura) > 0) {
                for (const cmd of cmds) {
                    setTimeout(async() => {
                        await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData : t });

                        d.client.db.delete(d.client.db.tables[0], data.key)
                    }, dura)
                }
            }
            else {
                d.client.db.delete(d.client.db.tables[0], data.key)
            }
        }
    }
    else {
        if (name) {
            cmds = cmds.filter(x => x.name === name);
        }
        for (const cmd of cmds) {
            setTimeout(async () => {
                await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });

                d.client.db.delete(d.client.db.tables[0],'setTimeout',timeoutData.__id__);
            }, duration)
        }
    }
}