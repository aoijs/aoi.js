module.exports = {
    id: "The ID of the role;.id",
    name: "The name of the role;.name.deleteBrackets()",
    position: "The position of this role;.position",
    rawPosition: "The position of this role given by the API;.rawPosition", 
    hexColor: "The hex color for this role;.hexColor", 
    color: "The color of this role;.color",
    hoist: "Whether the role is hoisted or not;.hoist",
    mentionable: "Whether the role is mentionable or not;.mentionable",
    guildID: "The ID of the guild the role belongs to;.guild.id",
    editable: "Whether the role is editable by the client or not;.editable", 
    managed: "Whether this role is managed by discord or not;.managed", 
    deleted: "Whether the role was deleted or not;.deleted", 
    permissions: "The permissions for this role;.permissions.toArray().map(phrase => phrase.split('_').map(word => word.toLowerCase().replace(word[0].toLowerCase(), word[0])).join(' ')).join(', ')" 
}