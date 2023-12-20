module.exports = d => {
    let data = d.util.aoiFunc(d);
    const months = ['january', 'febuary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
    data.result = months[new Date(new Date().toLocaleString('en-us', {timeZone: d.timezone})).getMonth()];

    return {
        code: d.util.setCode(data)
    }
}