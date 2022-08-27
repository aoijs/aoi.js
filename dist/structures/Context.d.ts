import { AutocompleteInteraction, ButtonInteraction, CacheType, Channel, CommandInteraction, ContextMenuCommandInteraction, Guild, GuildMember, GuildMemberManager, Message, MessageReaction, ModalSubmitInteraction, SelectMenuInteraction, TextBasedChannel, User } from "discord.js";
import { Option } from "../typings";
/**
 * The context stores a class from discord.js.
 */
export declare class Context<T> {
    #private;
    data: T;
    $memberManager: Option<GuildMemberManager>;
    constructor(data: T);
    isMessage<T extends boolean = boolean>(): this is Context<Message<T>>;
    isUser(): this is Context<User>;
    isGuildMember(): this is Context<GuildMember>;
    isGuild(): this is Context<Guild>;
    isInteraction<T extends CacheType = CacheType>(): this is Context<SelectMenuInteraction<T> | ButtonInteraction<T> | ModalSubmitInteraction<T>>;
    isChannel(): this is Context<Channel>;
    as<T>(): Context<T>;
    set<T extends keyof this>(key: T, value: this[T]): this;
    getMainChannel<T extends TextBasedChannel = TextBasedChannel>(): Option<T>;
    isAutocompleteInteraction<T extends CacheType = CacheType>(): this is Context<AutocompleteInteraction<T>>;
    getAutocompleteInteraction<T extends CacheType = CacheType>(): Option<AutocompleteInteraction<T>>;
    setChannel<T extends TextBasedChannel = TextBasedChannel>(channel: unknown): Option<T>;
    setMessage(m: Option<Message>): Option<Message>;
    setGuild(guild: Option<Guild>): Option<Guild>;
    setUser(user: Option<User>): Option<User>;
    setMember(member: Option<GuildMember>): Option<GuildMember>;
    /**
     * Gets the context guild, this is not guaranteed.
     */
    getGuild(): Option<Guild>;
    getMessage(): Option<Message>;
    isReactionMessage(): this is Context<MessageReaction>;
    /**
     * Gets the context guild member, if any.
     */
    getGuildMember(): Promise<Option<GuildMember>>;
    /**
     * Gets the context user, this is not guaranteed.
     * @returns
     */
    getUser(): Option<User>;
    getInteraction<T extends CacheType = CacheType>(): Option<SelectMenuInteraction<T> | ButtonInteraction<T> | ModalSubmitInteraction<T>>;
    isContextMenuInteraction<T extends CacheType = CacheType>(): this is Context<ContextMenuCommandInteraction<T>>;
    getContextMenuInteraction(): Option<ContextMenuCommandInteraction>;
    getSlashCommand(): Option<CommandInteraction>;
    isSlashCommand<T extends CacheType = CacheType>(): this is Context<CommandInteraction<T>>;
}
//# sourceMappingURL=Context.d.ts.map