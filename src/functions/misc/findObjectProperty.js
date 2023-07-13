module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [objectProperty, objectName] = data.inside.splits;

    if (!objectName) return d.aoiError.fnError(d, 'custom', {}, 'Missing object!');

    if (!objectProperty) return d.aoiError.fnError(d, 'custom', {}, 'Missing object property names!');

    const propertyNames = objectProperty.split(",");
    const object = JSON.parse(objectName);
    const results = {};

    propertyNames.forEach(propertyName => {
        if (propertyName in object) {
            results[propertyName] = object[propertyName];
        }
    });

    data.result = JSON.stringify(results);
    return {
        code: d.util.setCode(data)
    };
}
