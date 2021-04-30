function script(parent, resolver) {
	let alive = false

	parent.postMessage('PING!')

	parent.on('message', obj => {

		if (!alive) alive = true
		if (!obj.id) return

		let status = 1
		let posted = 0

		const message = {
			data: obj.data,
			resolve: data => {
				status = 1

				postMessage(data)
			},
			reject: data => {
				status = 0

				postMessage(data)
			}
		}

		resolver(message)

		function postMessage(data) {
			if (posted) return

			const msg = {
				id: obj.id,
				status,
				data
			}

			posted = 1
			
			if (!alive) alive = true

			parent.postMessage(msg)
		}
	})

	setInterval(() => {
		if (!alive) process.exit()

		alive = false
	}, 5000)
}

module.exports = script