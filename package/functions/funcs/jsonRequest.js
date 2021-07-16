const errorHandler = require("../../handlers/errors.js")
const axios = require('axios').default

module.exports = async d => {

	const code = d.command.code

	const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

	const headers = {
		'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (aoi.js; https://www.npmjs.com/package/aoi.js)'
	}
	const [url, get = '', error, ...header] = inside.splits

	for (let head of header) {
		head = head.addBrackets()

		const [headName, ...headValue] = head.split(':')

		headers[headName.addBrackets()] = headValue.join(':').addBrackets()
	}

	const request = await axios.request({
		url: url.addBrackets(),
		headers,
		method: 'GET',
		responseType: 'text',
		transformResponse(data) {
			try {
				return JSON.parse(data)
			} catch {
				return data
			}
		}
	}).catch(d.noop)

	if (!request) {
		if (error) errorHandler(d, error)

		return
	}

	const response = request.data

	if (!response) {
		if (error) errorHandler(d, error)

		return
	}

	let req = response

	if (typeof req === 'object') {
		if (!get.length) req = JSON.stringify(req)
		else {
			try {
				const g = get.addBrackets()

				req = eval(`response` + (["[", "."].some(e => g.startsWith(e)) ? g : `.${g}`)) || ""
			} catch {
				if (error) errorHandler(d, error)

				return
			}
		}
	}

	return {
		code: code.replaceLast(`$jsonRequest${inside}`, typeof req === "string" ? req.removeBrackets() : req || "")
	}
}