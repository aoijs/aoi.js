import { ActionRowBuilder, MessageActionRowComponentBuilder, UnsafeEmbedBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";
import { Option } from "../types/Option";
import { ReplyType } from "../types/ReplyType";
export interface ContainerData {
    content: Option<string>;
    components: Array<ActionRowBuilder<MessageActionRowComponentBuilder>>;
    files: Array<MessageAttachment>;
    attachments: Array<MessageAttachment>;
    embeds: Array<UnsafeEmbedBuilder>;
    replyType: ReplyType;
    ephemeral: boolean;
    fetchReply: boolean;
}
//# sourceMappingURL=ContainerData.d.ts.map