const { Routes } = require("discord-api-types/v10");
const { resolveBase64, resolveFile } = require("discord.js/src/util/DataResolver");

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [banner] = data.inside.splits;

    if (!banner.startsWith("data:")) {
        const file = await resolveFile(banner);
        banner = resolveBase64(file.data);
    }

    await d.client.rest.patch(Routes.user(), {
        body: {
          username: d.client.user.username,
          avatar: d.client.user.avatar,
          banner: banner,
        },
    });

    return {
        code: d.util.setCode(data)
    }
};