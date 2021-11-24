const ytsr = require('youtube-sr').default
//const {AxiosInstance} = require('axios')
const scdl = require('soundcloud-downloader').default
const ytdl = require('ytdl-core-discord')

class Youtube {
    get baseYtUrl() {
        return ["https://youtube.com", "www.youtube.com", "https://m.youtube.com", "https://youtu.be/"]
    }

    async search(track, options = {limit: 1}) {
        if (this.baseYtUrl.some(x => track.startsWith(x))) {
            if (track.includes("playlist?list=")) {
                console.log("playlist worked")
                let playlist = await ytsr.getPlaylist(track)
                if (playlist.videoCount > 100) {
                    playlist = await playlist.fetch()
                }
                return playlist.videos.map(x => x.id)
            } else return [track.split("/").pop()]
        } else {
            const vid = (await ytsr.search(track, options))
            return vid.map(x => x.id)
        }
    }

    async getData(url, yt) {
        const info = await ytdl.getInfo(url, yt)
        const stream = await ytdl.downloadFromInfo(info, yt)
        return {info, stream}
    }

    async getStream(info, yt) {
        const stream = await ytdl.downloadFromInfo(info, yt)
        return stream
    }
}

class SoundCloud {
    get baseScUrl() {
        return ["https://soundcloud.com/", "https://m.soundcloud.com"]
    }

    parseUrl(url) {
        return url.replace("https://m.soundcloud.com", "https://soundcloud.com")
    }

    async search(track, sc, limit = 1) {
        if (this.baseScUrl.some(x => track.startsWith(x))) {
            if (track.split("/")[4] === "sets") {
                const set = await scdl.getSetInfo(track, sc?.clientId)
                return set.tracks.map(x => x.permalink_url)
            } else if (track.endsWith("/likes")) {
                const arr = track.split("/")
                arr.pop()
                const likeUrl = arr.join("/")
                const {collection} = await scdl.getLikes({profileUrl: likeUrl}, sc?.clientId)
                return collection.map(x => x.track.permalink_url)
            } else return [track]
        } else {
            const {collection} = await scdl.search({limit: limit, query: track})
            return Array.isArray(collection) ? [collection[0].permalink_url] : [collection.permalink_url]
        }
    }

    async getData(url, sc) {
        const info = await scdl.getInfo(url, sc?.clientId)
        const stream = await scdl.download(url, sc?.clientId)
        return {info, stream}
    }

    async transcodStream(link, sc) {
        /* const sx = require('soundcloud-downloader/dist/download-media'). default
         const media = await sx(link,sc?.clientId||"",require("axios"))
       return media */
    }
}

class Search {
    constructor() {
        this.Youtube = new Youtube()
        this.SoundCloud = new SoundCloud()
    }
}

module.exports = Search;