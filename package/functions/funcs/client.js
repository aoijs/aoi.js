const moment = require("moment");
const ms = require("parse-ms");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let option = inside.inside;

  let bapp = await d.client.application 
  if(!option) return d.error(d.aoiError.functionErrorResolve(d,"custom",{inside},"No Oqption Provided"))
  const data = {
      token:d.client.token,
      prefix:d.client.prefix,
      readyAt:d.client.readyAt.toString(),
      readyTimestamp:d.client.readyTimestamp,
      uptime:d.client.uptime,
      shards:d.client.ws.totalShards 
  }
  Object.assign(data,d.client.user) 
    delete data.presence 
    delete data.client
    delete data.dmChannel 
    data.avatar = d.client.user.displayAvatarURL()
    data.flags = data.flags.toArray().join(",") === "" ? "none": d.client.users.flags.toArray().join(" , ")
return {
    code:code.replaceLast(`$client${inside}`,data[option]||"")


}
}
