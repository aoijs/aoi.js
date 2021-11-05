module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [number, sep = ','] = data.inside.splits;

    if (isNaN(number)) return d.aoiError.fnError(d, 'custom', {}, 'Invalid Number Provided In');

    const splits = number.split('.');

    data.result = sepNumber(splits[0], sep, 3);
    if (splits[1]) {
        data.result = data.result +'.'+ splits[1];
    }

    return {
        code: d.util.setCode(data)
    }
}

function sepNumber(number, sep) {
    let length = number.length;
    const num = [];

    for (let i = 0; i < 3; i++) {
        if (length < 0) {
            break;
        }
        else {
            if (i === 2) {
                i = 0;
                num.push(sep + number[length]);
            }
            else {
                num.push(number[length]);
            }
            length--
        }
    }
    return num.revers().join('');
}
