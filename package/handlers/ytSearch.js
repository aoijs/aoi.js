const { parentPort } = require('worker_threads')
const yts = require('yt-search')

require('./workerScript')(parentPort, async message => {
	try {
		message.data.userAgent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (dbd.js; https://www.npmjs.com/package/dbd.js)'

		const meta = await yts(message.data)

		if (meta.duration) {
			delete meta.duration.toString
		} else if (Array.isArray(meta.videos)) {
			for (const video of meta.videos) {
				delete video.duration.toString
			}

			delete meta.all
			delete meta.live
			delete meta.lists
			delete meta.playlists
			delete meta.accounts
			delete meta.channels
			delete meta.author
			delete meta.image
		}

		message.resolve(meta)
	} catch (err) {
		message.reject(err)
	}
})
