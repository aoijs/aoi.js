module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [...content] = data.inside.splits;

    if (!d.data.cv2) d.data.cv2 = [];

    let url = undefined;
    const textComponents = content.map((text) => {
        console.log(text)
        return {
            type: 10,
            content: text.addBrackets()
        };
    });

    d.data.cv2.push({
        type: 9,
        components: [...textComponents],
        accessory: {
            type: 11,
            media: {
                url: "https://github.com/faf4a.png"
            }
        }
    });

    return {
        code: d.util.setCode(data)
    };
};
