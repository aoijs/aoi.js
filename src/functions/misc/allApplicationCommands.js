/**  
 * @param {import("..").Data} d  
 */  
module.exports = async (d) => {  
    const data = d.util.aoiFunc(d);  

    if (data.err) return d.error(data.err);  

    let [separator = ','] = data.inside.splits;  
    const slashCommands = await d.client.application.commands.fetch().catch((e) => {
         d.aoiError.fnError(d, 'custom', {}, 'Failed To Fetch Slash Commands With The Reason: ' + e);  
         });  
    data.result = slashCommands.map(command => command.name).join(separator);

    return {  
        code: d.util.setCode(data),  
    };  
};