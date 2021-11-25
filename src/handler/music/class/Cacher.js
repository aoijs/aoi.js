const Group = require('../../../cachehandler/index.js').limitedCache
const fs = require('fs')

class Cacher {
    constructor(limit = 50) {
        this.cache = new Group(limit)
        this.limit = limit
    }

    cache(id, stream, guildId) {
        if (this.cache.size < this.limit) {
            if (!fs.existsSync(process.cwd() + '/music')) {
                fs.mkdirSync(process.cwd() + '/music')
            }
            if (!fs.existsSync(process.cwd() + '/music/' + guildId)) {
                fs.mkdirSync(process.cwd() + '/music/' + guildId)
            }
            const path = process.cwd() + `/music/${guildId}/${id}`
            fs.open(path, "w", () => {
            })
            const writeable = fs.createWriteStream(path)
            stream.pipe(writeable)
            this.cache.set(id, path)
        }
    }
}

module.exports = Cacher