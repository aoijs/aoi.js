const { DbdTsDb, AoijsAPI, CustomDb, Promisify } = require("../../classes/Database.js");

module.exports = async (d, name, duration, timeoutData, onReady) => {
    let cmds = d.client.cmd.timeout.allValues();

    if (onReady) {
        const datas = await d.client.db.all(d.client.db.tables[0], 'setTimeout');
        let value;
        for (const data of datas.filter(x => {
            if (d.client.db instanceof AoijsAPI) {
                value = x.data.value;
                return !x.data.value.__pulseEvery__;
            }
            else if (d.client.db instanceof DbdTsDb) {
                value = x['setTimeout'];
                return !x['setTimeout'].__pulseEvery__;
            }
            else if (d.client.db instanceof CustomDb || d.client.db instanceof Promisify) {
                value = x.value || x['setTimeout'] || ((typeof x.data === 'object' && x.data.value) ? x.data.value : x.data)
                return !x?.value?.__pulseEvery__ && !x['setTimeout']?.__pulseEvery__ && (typeof x.data === 'object' ? !x.data.value?.__pulseEvery__ : !x.data?.__pulseEvery__);
            }
        })) {
            const t = value;
            const dura = (t.__duration__ - Date.now());
            cmds = cmds.filter(x => x.name === t.__timeoutName__);
            if ((dura) > 0) {
                for (const cmd of cmds) {
                    setTimeout(async () => {
                        await d.interpreter(d.client, {}, [], cmd, d.client.db, false, undefined, { timeoutData: t });

                        await d.client.db.delete(d.client.db.tables[0], data.key)
                    }, dura)
                }
            }
            else {
                await d.client.db.delete(d.client.db.tables[0], data.key)
                continue;
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

                d.client.db.delete(d.client.db.tables[0], 'setTimeout', timeoutData.__id__);
            }, duration)
        }
    }
}