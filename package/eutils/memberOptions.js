module.exports = {
    id: "The ID of the user;.id", 
    name: "The name of this user;.user.username.deleteBrackets()", 
    guildID: "The ID of the guild this member was updated on;.guild.id",
    nick: "The nickname of this user before it was updated, if any;.nickname || ''", 
    roles: "The role names of the user before it was updated;.roles.cache.filter(r => r.name !== '@everyone').map(r => r.name.deleteBrackets()).join(', ')", 
    partial: "Whether the member structure is cached;.partial ? `true` : `false`", 
    premiumStamp: "The timestamp this user started boosting the server, or 0 if they're not boosting;.premiumSinceTimestamp || `0`", 
    joinedStamp: "The timestamp when this user joined the server;.joinedTimestamp",
    voiceID: "The ID of the voice channel this user's in;.voice.channelID || ''", 
    displayHex: "Returns the hex color of this user's highest role;.displayHexColor", 
    highestRoleID: "The ID of the highest role of this user in the guild;.roles.highest.id",
    permissions: "The permissions for this member;.permissions.toArray().goof('_')", 
    newPermissions: `The new permissions for this member.;;(() => {
        const curr = d.data.new_member.permissions.toArray()
        const old = d.data.old_member.permissions.toArray() 
        
        return curr.filter(p => !old.includes(p)).goof("_")
    })()`, 
    removedPermissions: `The removed permissions for this member.;;(() => {
        const curr = d.data.new_member.permissions.toArray()
        const old = d.data.old_member.permissions.toArray() 
        
        return old.filter(p => !curr.includes(p)).goof("_")
    })()`, 
    bannable: "Whether the user is bannable by the client;.bannable",
    kickable: "Whether the user is kickable by the client;.kickable",
    manageable: "Whether the user can be managed by the client;.manageable", 
    displayColor: "Displays the hex color of the highest role in this user;.displayHexColor",
    status: "The status for this user;.presence.status",
    activities: "The activities for this user;.presence.activities.map(c => c.name).join(', ')", 
    removedRoles: `The removed roles for this user (mapped by names);;(() => {
        const curr = d.data.new_member.roles.cache 
        const old = d.data.old_member.roles.cache 
        
        return old.filter(r => !curr.has(r.id)).map(r => r.name).join(", ").deleteBrackets() 
    })()`, 
    addedRoles: `The new roles (mapped by names) for this user.;.roles.cache.filter(r => !d.data.old_member.roles.cache.has(r.id)).map(r => r.name).join(", ").deleteBrackets()`
}