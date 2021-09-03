const {wait} = require('../../Utils/helpers/functions.js') 
module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  let fields = inside.splits;
  let time = fields.shift()
  let endcmd = fields.pop() 
  if(!isNaN(time)) d.error(`${d.func} Invalid Time(in ms) Provided In ${inside}`) 
  for (const channel of d.client.channels.cache.values()) {
    for (const command of fields) {
      const cmd = d.client.cmd.awaited.find((e) => e.name === command);
      if (!cmd)
        return d.error(
          `\`${d.func}: Invalid awaited command ${command} in ${inside}\``
        );
      d.interpreter(d.client,{
     message:d.message,
     channel: channel,
     guild: channel.guild,
     author:d.author,
     member:d.member,
     client:d.client
      }, d.args, cmd);
    }
      await wait(time) 
  }
  await d.interpreter(d.client,d.message,d.args,endcmd)
  return {
    code: code.replaceLast(`$forEachChannel${inside}`, ""),
  };
};