const { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType, InteractionType, ComponentType } = require("discord.js");

const InteractionTypes = {
    [InteractionType.Ping]: "ping",
    [InteractionType.ApplicationCommand]: "slash",
    [InteractionType.MessageComponent]: "component",
    [InteractionType.ApplicationCommandAutocomplete]: "autocomplete",
    [InteractionType.ModalSubmit]: "modal"
};

const MessageComponentTypes = {
    [ComponentType.ActionRow]: "actionRow",
    [ComponentType.Button]: "button",
    [ComponentType.StringSelect]: "selectMenu",
    [ComponentType.ChannelSelect]: "selectMenu",
    [ComponentType.RoleSelect]: "selectMenu",
    [ComponentType.UserSelect]: "selectMenu",
    [ComponentType.MentionableSelect]: "selectMenu",
    [ComponentType.TextInput]: "modal"
};

const SlashTypes = {
    slash: ApplicationCommandType.ChatInput,
    user: ApplicationCommandType.User,
    message: ApplicationCommandType.Message
};

const ContextTypes = {
    botdm: InteractionContextType.BotDM,
    dm: InteractionContextType.PrivateChannel,
    guild: InteractionContextType.Guild
};

const IntegrationTypes = {
    guild: ApplicationIntegrationType.GuildInstall,
    user: ApplicationIntegrationType.UserInstall
}

module.exports = {
    InteractionTypes: InteractionTypes,
    MessageComponentTypes: MessageComponentTypes,
    SlashTypes,
    ContextTypes,
    IntegrationTypes
};
