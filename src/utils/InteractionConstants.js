const InteractionTypes = {
    PING: "ping",
    APPLICATION_COMMAND: "slash",
    MESSAGE_COMPONENT: "component",
};
const MessageComponentTypes = {
    ACTION_ROW: "actionRow",
    BUTTON: "button",
    SELECT_MENU: "selectMenu",
};
const SlashTypes = {
    slash: "CHAT_INPUT",
    user: "USER",
    message: "MESSAGE",
};
module.exports = {
    InteractionTypes: InteractionTypes,
    MessageComponentTypes: MessageComponentTypes,
    SlashTypes,
};
