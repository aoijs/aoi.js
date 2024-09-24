const { ButtonBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder, RoleSelectMenuBuilder, MentionableSelectMenuBuilder, ChannelSelectMenuBuilder, ActionRowBuilder } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let [channelId, messageId, type = "all"] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });
    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });

    const components = message.components;

    type = type.toLowerCase();

    const ActionRow = components.map((row) => {
        const newButtons = row.components.map((component) => {
            if (component.type === 2 && (type.toLowerCase() === "button" || type.toLowerCase() === "all")) {
                return ButtonBuilder.from(component).setDisabled(true);
            } else if (type === "selectmenu" || type === "all") {
                if (component.type === 3) {
                    return StringSelectMenuBuilder.from(component).setDisabled(true);
                } else if (component.type === 5) {
                    return UserSelectMenuBuilder.from(component).setDisabled(true);
                } else if (component.type === 6) {
                    return RoleSelectMenuBuilder.from(component).setDisabled(true);
                } else if (component.type === 7) {
                    return MentionableSelectMenuBuilder.from(component).setDisabled(true);
                } else if (component.type === 8) {
                    return ChannelSelectMenuBuilder.from(component).setDisabled(true);
                } else {
                    return component;
                }
            } else {
                return component;
            }
        });
        return new ActionRowBuilder().addComponents(newButtons);
    });

    await message.edit({ components: ActionRow });

    return {
        code: d.util.setCode(data)
    };
};
