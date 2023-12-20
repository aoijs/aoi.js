const fs = require('fs');

module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [oldfile, newfile] = data.inside.splits;

    if (fs.existsSync(oldfile) && !fs.existsSync(newfile)) {

        fs.renameSync(oldfile, newfile)

    } else {
        if (!fs.existsSync(oldfile)) return d.aoiError.fnError(d, 'custom', {}, `Couldn't Found the ${oldfile} file`)
        if (fs.existsSync(newfile)) return d.aoiError.fnError(d, 'custom', {}, `File with name \`${newfile}\` already exist`)


    }
    return {
        code: d.util.setCode(data)
    }
}