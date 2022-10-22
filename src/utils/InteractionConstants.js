const InteractionTypes = {
    PING: "ping",
    APPLICATION_COMMAND: "slash",
    MESSAGE_COMPONENT: "component",
    MODAL_SUBMIT : "modal",
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
  modal: "MODAL_SUBMIT",
};
module.exports = {
    InteractionTypes: InteractionTypes,
    MessageComponentTypes: MessageComponentTypes,
    SlashTypes,
};