const {SlashOptionsParser} = require('../../../handler/parsers.js')
module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [guildId, id, ...Datas] = data.inside.splits;
    let DATA;

    if (guildId === 'custom') {
        const cmd = await d.client.application.commands.fetch(id).catch(e => {
            d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Id Provided In');
        });

        DATA = d.client.interactionManager.applicationData.get(cmd.name);

        cmd.edit(DATA.data);
    } else {
        if (Datas.length === 1) {
            try {
                DATA = JSON.parse(Datas[0]);
            } catch (e) {
                DATA = {
                    name: Datas[0]?.addBrackets(),
                }
            }
        } else {
            DATA = {
                name: Datas[0]?.addBrackets(),
                description: Datas[1]?.trim()?.addBrackets() || null,
                type: Number(Datas[2]) < 1 ? 1 : Number(Datas[2]),
                options: await SlashOptionsParser(Datas[3] || ''),
                defaultPermission: Datas[4] === 'yes'
            }
        }
        d.client.application.commands.edit(id, DATA, guildId === 'global' ? undefined : guildId).catch(e => {
            d.aoiError.fnError(d, 'custom', {}, 'Failed To Edit Application Command With Reason: ' + e);
        });
    }

    return {
        code: d.util.setCode(data)
    }
}