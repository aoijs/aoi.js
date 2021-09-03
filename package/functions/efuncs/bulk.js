
module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);
  if (err) return d.error(err);
    let result;
    switch(inside.inside){
            case "amount":
            result = d.data.bulk.size 
            break;
            case "messages":
            result = d.data.bulk.map(x=>x.content).join(" , ") 
            break;
            case "userids":
            result = d.data.bulk.map(x=>x.author.id).join(" , ")
            break;
            case "usernames":
            result = d.data.bulk.map(x=>x.author.username).join(" , ")
            break;
            case "usertags":
            result = d.data.bulk.map(x=>x.author.tag).join(" , ") 
            break;
            case "channelid":
            result = d.data.bulk.first().channel.id 
            break;
            case "channel":
            result = d.data.bulk.first().channel.name 
            break;
            case "guildid":
            result = d.data.bulk.first().guild.id
            break;
            case "guild":
            result = d.data.bulk.first().guild.name 
            break;
            case "timestamp":
            result = d.data.bulk.map(x=>x.createdTimedstamp).join(' , ') 
            break; 
            case "messageId":
            result = d.data.bulk.map(x=>x.id).join(" , ") 
            break;
    }
  return {
    code: code.replaceLast(
      `$bulk${inside}`,
      result 
    ),
  };
};