//user options for incoming function 
module.exports = {
    id: "The ID of the user;.id", 
    partial: "Whether the User structure is partial or not;.partial", 
    avatar: "The old avatar of the user;.displayAvatarURL({dynamic:true,size:4096})", 
    system: "Whether the user is part of the official discord team;.system",
    discriminator: "The outdated discriminator for this user;.discriminator", 
    tag: "The tag for this user;.tag.deleteBrackets()", 
    bot: "Whether the user is a bot or not;.bot", 
    username: "The old username of this user;.username.deleteBrackets()", 
    status: "The status of this user;.presence.status",
    activities: "The activities for this user;.presence.activities.join(' ').deleteBrackets()",
}