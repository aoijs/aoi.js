const { ApplicationCommandType, InteractionType, ComponentType } = require("discord.js");

const InteractionTypes = {
    PING: InteractionType.Ping,
    APPLICATION_COMMAND: InteractionType.ApplicationCommand,
    MESSAGE_COMPONENT: InteractionType.MessageComponent,
    MODAL_SUBMIT: InteractionType.ModalSubmit,
    APPLICATION_AUTOCOMPLETE: InteractionType.ApplicationCommandAutocomplete,
};
const MessageComponentTypes = {
    ACTION_ROW: ComponentType.ActionRow,
    BUTTON: ComponentType.Button,
    STRING_SELECT: ComponentType.StringSelect,
    INTEGER_SELECT: ComponentType.IntegerSelect,
    ROLE_SELECT: ComponentType.RoleSelect,
    USER_SELECT: ComponentType.UserSelect,
    CHANNEL_SELECT: ComponentType.ChannelSelect,
    MENTIONABLE_SELECT: ComponentType.MentionableSelect,
    TEXT_INPUT: ComponentType.TextInput,
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
