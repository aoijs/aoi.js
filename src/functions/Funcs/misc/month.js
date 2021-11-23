module.exports = d => {
    let {code, result} = d.util.openFunc(d);
    const months = ['january', 'febuary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
    result = months[new Date(new Date().toLocaleString('en-us', {timeZone: d.timezone})).getMonth()];

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}