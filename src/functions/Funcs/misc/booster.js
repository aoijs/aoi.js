const {get} = require('axios')
module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();

    const {data} = await get(`https://dbdjs.leref.ga/booster/${d.client.aoiData.ownerId}`);

    const result = data ? true : false;

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}