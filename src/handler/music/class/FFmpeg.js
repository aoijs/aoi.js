const prism = require('prism-media')
const {PassThrough} = require('stream')

class FFmpeg {
    constructor() {
        this.filters = ["aresample=48000"]
        this.seekTo = "00:00:00"
        this.args = [
            '-analyzeduration', '0',
            '-loglevel', '0',
            '-f', 's16le',
            '-ar', '48000',
            '-ac', '2',
            '-ss', this.seekTo,
            '-af', this.filters?.join(",")
        ]

    }

    transformStream(stream) {
        this.seekTo = "00:00:00"
        const ffmpeg = new prism.FFmpeg({
            args: this.args
        })
        const opus = new prism.opus.Encoder({rate: 48000, channels: 2, frameSize: 960})
        return stream.pipe(ffmpeg).pipe(opus)
    }

    setSeekTo(timestamp) {
        this.seekTo = timestamp / 1000
    }

    addFilters(...filters) {
        if (!this.args.includes("-af")) this.args.push("-af")

        this.filters.concat(filters)
    }

    patchFilters(...filters) {
    }

    removeFilters(...filters) {
    }

    setFilters(...filters) {
        if (!this.args.includes("-af")) this.args.push("-af")

        this.filters = filters
        const index = this.args.indexOf("-af")
        this.args[index + 1] = this.filters?.join(",")
    }
}

module.exports = FFmpeg;