module.exports = {
    CacheMethods(d, name) {
        const manager = d.client.cacheManager.caches;
        const data = {
            cache: {
                allKeys: manager[name].allKeys,
                allValues: manager[name].allValues,
                bottom: manager[name].bottom,
                clear: manager[name].clear,
                concat: manager[name].concat,
                entries: manager[name].entries,
                every: manager[name].every,
                filter: manager[name].filter,
                set: manager[name].set,
                get: manager[name].get,
                delete: manager[name].delete,
            },
        };
    },
};
