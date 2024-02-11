module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [...regex] = data.inside.splits;

    console.log({ 
        triggerMetadata: { 
            regexPatterns: regex, 
            ...d.data.automodRule?.triggerMetadata 
        },
        ...d.data.automodRule 
    })

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