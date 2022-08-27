import { ActionRowBuilder, MessageActionRowComponentBuilder, EmbedBuilder } from "@discordjs/builders";
import { Attachment } from "discord.js";
import { Option } from "../types/Option";
import { ReplyType } from "../types/ReplyType";
export interface ContainerData {
    content: Option<string>;
    components: Array<ActionRowBuilder<MessageActionRowComponentBuilder>>;
    files: Array<Attachment>;
    attachments: Array<Attachment>;
    embeds: Array<EmbedBuilder>;
    replyType: ReplyType;
    ephemeral: boolean;
    fetchReply: boolean;
}
//# sourceMappingURL=ContainerData.d.ts.map