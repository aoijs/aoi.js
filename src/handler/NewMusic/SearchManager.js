////requiring
const ytsr = require('youtube-sr');
const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader').default;
const axios = require('axios');
const fs = require('fs');

////base class for each type 
//Attachment class 
class Attachment {
    static async getStream(url) {
        const {data} = await axios.get(url);
        return data;
    }

    static getInfo(url, description = "An Track Taken From The Attachment") {
        const data = {
            title: url.split("/").pop(),
            description,
            url
        }

        return data;
    }

    static async getData(url) {
        return {
            stream: await this.getStream(url),
            info: this.getInfo(url)
        }
    }
}

//fs class 
class Fs {
    static getStream(path) {
        const stream = fs.createReadStream(process.cwd() + `/${path}`);
        return stream;
    }

    static getInfo(path) {
        const data = {
            title: path,
            description: "A File In The Project",
            url: process.cwd() + `/${path}`
        }
        return data;
    }

    static getData(path) {
        return {
            stream: this.getStream(path),
            info: this.getInfo(path)
        }
    }
}

class Scdl {
    static async search(track) {
    }
}