module.exports = {
$abbreviate : {
desc:"abbreviates the Number", 
    usage:"$abbreviate[number,decimal?]"
},
$activity : {
    desc:"Shows Provided User's Activity",
    usage:"$activity[userId?] | $activity"
},
$addButton: {
    desc:"Adds A Button Component",
    usage:"$addButton[index;label;style;customId/Url;disabled?;emoji?]" 
},
$addCmdReactions:{
    desc:"Adds Reactions To Author's Message",
    usage:"$addCmdReactions[timeToWait;Reaction;Reaction;...]"
},
$addEmoji:{
    desc:"adds An emoji To server",
    usage:"$addEmoji[guildId;url;name;reason?;roleId;roleId;...]" 
}
}