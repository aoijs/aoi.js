const { ApplicationCommandType } = require( "discord.js" );

const InteractionTypes = {
    PING: "ping",
    APPLICATION_COMMAND: "slash",
    MESSAGE_COMPONENT: "component",
    MODAL_SUBMIT: "modal",
};
const MessageComponentTypes = {
    ACTION_ROW: "actionRow",
    BUTTON: "button",
    SELECT_MENU: "selectMenu",
};
const SlashTypes = {
    slash: ApplicationCommandType.ChatInput,
    user: ApplicationCommandType.User,
    message: ApplicationCommandType.Message,
};
module.exports = {
    InteractionTypes: InteractionTypes,
    MessageComponentTypes: MessageComponentTypes,
    SlashTypes,
};