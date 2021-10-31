module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id] = data.inside.splits;

    const user = (userId === d.author?.id) ? d.author : (await d.util.getUser(d, userId));

    data.result = user ? true : false;

    return {
        code: d.util.setCode(data)
    }
}