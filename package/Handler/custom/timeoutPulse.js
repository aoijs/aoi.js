module.exports = async (d, name, duration, pulse, timeoutData, onReady) => {
    let cmds = d.client.cmd.pulse.allValues();

    if (onReady) {
        const datas = await d.client.db.all(d.client.db.tables[0], x => x.key.startsWith('setTimeout'));
        for (const data of datas.filter(x => x.data.value.__pulseEvery__)) {
            const t = data.data.value;

            cmds = cmds.filter(x => x.name === t.__timeoutName__);
            if ((t.__duration__ - Date.now()) > 0) {
                for (const cmd of cmds) {

                    const interval = setInterval(async () => {
                        await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData : t });
                    }, t.__pulseEvery__);
                    setTimeout(() => {
                        clearInterval(interval)
                        d.client.db.delete(d.client.db.tables[0], data.key)
                    }, (t.__duration__ - Date.now()));
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
            const interval = setInterval(() => {
                d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData });
            }, pulse || duration);
            setTimeout(() =>{ 
                clearInterval(interval)
                d.client.db.delete(d.client.db.tables[0],'setTimeout',timeoutData.__id__);
            }, duration);
        }
    }
}