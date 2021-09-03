module.exports = {
    guildID: "The ID of the guild the voice state update happened in.;.guild.id", 
    guildName: "The name of the guild this voice state update happened in.;guild.name.deleteBrackets()",
    name: "The name of the user that updated its voice state.;.member.user.username.deleteBrackets()",
    id: "The ID of the user that updated its voice state.;.id", 
    channelID: "The ID of the voice channel this voice state update occurred in.;.channelID || ''",
    channelName: "The name of the voice channel this voice state update occurred in.;.channel.name.deleteBrackets() || ''",
    serverDeaf: "Whether the user is server deafened.;.serverDeaf ? `true` : `false`",
    selfDeaf: "Whether the user is self deafened.;.selfDeaf ? `true` : `false`", 
    selfMute: "Whether the user is self muted.;.selfMute", 
    serverMute: "Whether the user is server muted;.serverMute", 
    sessionID: "The ID of this voice session.;.sessionID || ''",
    streaming: "Whether this user is streaming.;.streaming || 'false'", 
    deaf: "Whether the user is either self-deafened or server-deafened.;.deaf",
    mute: "Whether the user is either self-muted or server-muted.;.mute",
    speaking: "Whether the user is speaking.;.speaking || 'false'"
}