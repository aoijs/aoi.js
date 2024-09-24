/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
  
    let [ guild = d.guild?.id ] = data.inside.splits;
  
    guild = await d.util.getGuild(d, guild);
  
    data.result = (await guild.fetchTemplates()).size > 0;
  
    return {
      code: d.util.setCode(data),
    };
  };
  