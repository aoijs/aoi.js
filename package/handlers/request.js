function request(url = '', options = {}, body = '') {
    return new Promise(async (resolve, reject) => {
        if (!['http:', 'https:'].includes(url.split('/')[0])) throw new TypeError('URL must be startswith http or https')

        let method = require("http")

        if (url.startsWith("https:")) method = require("https")

        if (!options.headers) options.headers = {}

        if (body.length) {
            options.headers["content-length"] = body.length
        }

        if (typeof options.headers['user-agent'] !== 'string')
            options.headers['user-agent'] = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (dbd.js; https://www.npmjs.com/package/dbd.js)'

        const req = method.request(url, options, async res => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
                try {
                    resolve(await request(new URL(res.headers.location, url).href, options))
                } catch (err) {
                    reject(err)
                }

                return
            }

			res.setEncoding('utf8')

            let data = ''

            res.on('data', chunk => {
                data += chunk
            })

            res.once('end', async () => {
                const obj = {
                    text: data,
                    code: res.statusCode,
                    headers: res.headers
                }

                if (typeof res.headers['content-type'] === 'string' ? res.headers['content-type'].startsWith('application/json') : false) {
                    try {
                        obj.json = JSON.parse(data)
                    } catch { }
                }

                resolve(obj)
            })
        })

        req.once('error', err => {
            reject(err)
		})

		if (body.length) {
			req.write(body)
		}

		req.end()
	})
}

module.exports = request