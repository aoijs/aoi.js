module.exports = d => {
    const data = d.util.aoiFunc(d);
    const [type = "users", sep = ", "] = data.inside.splits;

    const mentions = d.mentions;
    let result = ""
    switch (type) {
        case 'users':
            result = mentions.users.map(u => u.id).join(sep);
            break;
        case 'roles':
            result = mentions.roles.map(r => r.id).join(sep);
            break;
        default:
            break;
    }

    data.result = result

    return {
        code: d.util.setCode(data),
    };
}