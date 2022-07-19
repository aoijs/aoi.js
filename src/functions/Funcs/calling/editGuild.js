module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID, ...guildDatas] = data.inside.splits;
    let guildData;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    if (guildDatas.length === 1) {
        try {
            guildData = JSON.parse(guildDatas[0].addBrackets());
        } catch (e) {
            guildData = {
                name: guildDatas[0]?.addBrackets()
            }
        }
    } else {
        for (let i = 0; i < 18; i++) {
            if (!guildDatas[i]) guildDatas[i] = '$default';
            else continue;
        }
        guildData = {
            name: guildDatas[0]?.addBrackets(),
            verificationLevel: guildDatas[1]?.addBrackets() === '$default' ? guild.verificationLevel : guildDatas[1]?.addBrackets(),
            explicitContentFilter: guildDatas[2]?.addBrackets() === '$default' ? guild.explicitContentFilter : guildDatas[2]?.addBrackets(),
            afkChannel: guildDatas[3]?.addBrackets() === '$default' ? guild.afkChannel : guildDatas[3],
            systemChannel: guildDatas[4]?.addBrackets() === '$default' ? guild.systemChannel : guildDatas[4],
            afkTimeout: guildDatas[5]?.addBrackets() === '$default' ? guild.afkTimeout : Number(guildDatas[5]),
            icon: guildDatas[6]?.addBrackets() === '$default' ? guild.iconURL({
                size: 4096,
                dynamic: true
            }) : guildDatas[6]?.addBrackets(),
            owner: guildDatas[7]?.addBrackets() === '$default' ? guild.ownerId || (await guild.fetchOwner())?.id : guildDatas[7],
            splash: guildDatas[8]?.addBrackets() === '$default' ? guild.splashURL({
                size: 4096,
                dynamic: true
            }) : guildDatas[8]?.addBrackets(),
            discoverySplash: guildDatas[9]?.addBrackets() === '$default' ? guild.discoverySplashURL({
                size: 4096,
                dynamic: true
            }) : guildDatas[9]?.addBrackets(),
            banner: guildDatas[10]?.addBrackets() === '$default' ? guild.bannerURL({
                size: 4096,
                dynamic: true
            }) : guildDatas[10]?.addBrackets(),
            defaultMessageNotifications: guildDatas[11]?.addBrackets() === '$default' ? guild.defaultMessageNotifications : guildDatas[11]?.addBrackets(),
            systemChannelFlags: guildDatas[12]?.addBrackets() === '$default' ? guild.systemChannelFlags : guildDatas[12]?.addBrackets().split(','),
            rulesChannel: guildDatas[13]?.addBrackets() === '$default' ? guild.rulesChannel : guildDatas[13],
            publicUpdatesChannel: guildDatas[14]?.addBrackets() === '$default' ? guild.publicUpdatesChannel : guildDatas[14],
            preferredLocale: guildDatas[15]?.addBrackets() === '$default' ? guild.preferredLocale : guildDatas[15],
            description: guildDatas[16]?.addBrackets() === '$default' ? guild.description : guildDatas[16],
            features: guildDatas[17]?.addBrackets() === '$default' ? guild.features : guildDatas[17]?.addBrackets().split(',')
        }
    }

    guild.edit(guildData).catch(e => {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Failed To Edit Guild With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    }
}