const errorHandler = require('../../handlers/errors')
const methods = require('http').METHODS
const axios = require('axios').default.create({
	responseType: 'text',
	transformResponse(data) {
    if (data === undefined) return

		try {
			return JSON.parse(data)
		} catch {
			return data
		}
	}
})

module.exports = async d => {
	const code = d.command.code
	const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

	const header = {
		'User-Agent': 'DiscordBot (https://npmjs.com/package/aoi.js, 1.0.6)'
	}

	let [
		url,
		method = 'GET',
		body = '',
		property = '',
		error = '',
		...headers
	] = inside.splits

	if (!url) return d.error(`:x: No url specified in \`$httpRequest${inside}\``)

	url = url.addBrackets()
	method = method.toUpperCase()

	if (!methods.includes(method)) return d.error(`:x: Invalid method '${method}' in \`$httpRequest${inside}\``)

	for (let head of headers) {
		head = head.addBrackets()

		const [ headName, ...headValue ] = head.split(':')

		header[headName] = headValue.join(':')
	}

	let response = await axios.request({
		url,
		method,
		data: body,
		headers: header
	}).then(res => res.data).catch(err => undefined)

	if (response === undefined) {
		return execError()
	}

	if (typeof response === 'object') {
		if (!property) {
			response = JSON.stringify(response)
		} else {
			try {
				property = property.addBrackets()

				response = eval(`response${['[', '.'].includes(property[0]) ? property : `.${property}`}`) + ''
			} catch {
				return execError()
			}
		}
	}

	return {
		code: code.replaceLast(`$httpRequest${inside}`, typeof response === 'string' ? response.removeBrackets() : response)
	}

	function execError() {
		errorHandler(d, error)
	}
}