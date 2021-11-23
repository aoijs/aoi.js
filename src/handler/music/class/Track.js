const {TrackType} = require('../../../utils/VoiceConstants.js')

class Track {
    constructor(info, stream, resource, type, member) {
        this.stream = stream
        this.resource = resource
        this.rawInfo = info
        this.createInfo(info, type)
        // this.platform = TrackType[type]
        this.user = member
        this.type = type
    }

    createInfo(info, type) {
        if (type === 0) {
            info = info.videoDetails
            this.info = {
                title: info.title,
                description: info.description,
                publisher: {
                    profileUrl: info.ownerProfileUrl,
                    name: info.ownerChannelName,
                    thumbnail: info.author.thumbnails[0]?.url
                },
                views: info.viewCount,
                genre: info.category,
                publishedAt: info.publishDate,
                Id: info.videoId,
                url: info.video_url,
                likes: info.likes,
                dislikes: info.dislikes,
                thumbnail: info.thumbnails[0]?.url,
                duration: info.lengthSeconds * 1000
            }
        }
        if (type === 1) {
            this.info = {
                title: info.title,
                description: info.description,
                publisher: {
                    profileUrl: info.user.permalink_url,
                    name: info.user.username,
                    thumbnail: info.user.avatar_url
                },
                views: info.playback_count,
                genre: info.genre,
                publishedAt: info.createdAt,
                Id: info.id,
                url: info.permalink_url,
                likes: info.likes_count,
                dislikes: null,
                thumbnail: info.artwork_url,
                duration: info.duration
            }
        }
        if (type === 2) {
            this.info = {
                name: info
            }
        }
    }

    get durationLeft() {
        return this.info.duration - this.resource.duration
    }

    get currentDuration() {
        return this.resource.duration
    }
}

module.exports = Track