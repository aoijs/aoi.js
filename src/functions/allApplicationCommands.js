/**  
 * @param {import("..").Data} d  
 */  
module.exports = async (d) => {  
    const data = d.util.aoiFunc(d);  
  
    if (data.err) return d.error(data.err);  
  
    let [separator = ','] = data.inside.splits;  
    try {  
        const slashCommands = await d.client.application.commands.fetch();  
        const formattedSlashCommands = slashCommands.map(command => command.name).join(` ${separator} `)  
        data.result = formattedSlashCommands;
   } catch (e) {  
         return d.aoiError.fnError(d, 'custom', {}, `Failed to fetch all slash commands with the reason: ${e}`);  
    }  
    return {  
        code: d.util.setCode(data),  
    };  
};
