const { ComponentType } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [ channelId = d.channel?.id, messageId = d.message?.id, type = "any" ] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    const message = await d.util.getMessage(channel, messageId);

    let hasComponent = false;

    for (const row of message.components) {
        for (const component of row.components) {
            if (type === "any" || ComponentType[component.type] === type) {
                hasComponent = true;
                break;
            }
        }
        if (hasComponent) break;
    }

    data.result = hasComponent;

    return {
        code: d.util.setCode(data)
    }
};