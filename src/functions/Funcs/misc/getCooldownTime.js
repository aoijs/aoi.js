const {Time} = require('../../../utils/helpers/customParser.js');

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [time, type, cmdName, id] = data.inside.splits;

    time = Time.parse(time)?.ms
    if (!time) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Time Provided In');

    const types = {
        globalUser: id,
        user: `${id}_${d.message.guild.id || 'dm'}`,
        server: id,
        channel: id,
        static: undefined,
    }

    if (!types[type]) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Type Provided In');

    const timeEnd = await d.client.db.get(d.client.db.tables[0], 'cooldown', cmdName + "_" + types[type]);

    data.result = (timeEnd?.value || 0) - Date.now();

    return {
        code: d.util.setCode(data)
    }
}

