module.exports = async d => {
    const data = d.util.openFunc(d);

    let [time, awaitData, ...awaits] = data.inside.splits;

    try {
        awaitData = JSON.parse(awaitData);
    } catch (e) {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Data Provided In');
    }

    awaits.forEach(cmd => {
        if (!d.client.cmd.awaited.find(x => x.name.toLowerCase() === cmd.addBrackets().toLowerCase())) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, "Awaited Command : " + cmd + " Not Found");
    });

    for (let i = 0; i < time; i++) {
        for (let cmd of awaits) {
            cmd = d.client.cmd.awaited.find(x => x.name.toLowerCase() === cmd.addBrackets().toLowerCase());

            d.interpreter(d.client, d.message, d.args, cmd, d.client.db, false, undefined, {awaitData, ...d.data});
        }
    }

    return {
        code: d.util.setCode(data)
    }
}