/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [...regex] = data.inside.splits;

    return {
        code: d.util.setCode(data),
        data: { 
            automodRule: { 
                ...d.data.automodRule,
                triggerMetadata: { 
                    ...d.data.automodRule?.triggerMetadata,
                    regexPatterns: regex, 
                },
            },
        },
    };
};
