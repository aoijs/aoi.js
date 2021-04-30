const { randomBytes } = require('crypto')
const { EventEmitter } = require('events')
const { Worker } = require('worker_threads')

class WorkerPool extends EventEmitter {
	constructor(threads, options = {}, callback = null) {
		if (typeof options.filename !== 'string')
			throw new TypeError('Filename must be a string')

		super()

		this._workers = []
		this._options = options
		this._resolver = new Map()
		this._limit = threads || Math.min(Math.ceil(require('os').cpus().length * 0.74), process.env.MAX_WORKER_THREADS || 4)

		this.on('data', async obj => {
			let { status, data, id } = obj
			const resolver = this._resolver.get(id)

			this._resolver.delete(id)

			if (typeof callback === 'function') {
				const newData = await callback(data, id, status)

				if (newData) data = newData
			}

			if (status) resolver.resolve(data)
			else resolver.reject(data)
		})
	}

	get length() {
		return this._workers.length
	}

	get size() {
		return this._resolver.size
	}

	async post(data) {
		await this.spawn()

		const worker = this.getWorker()

		worker.postMessage('PING!')

		let id

		do {
			try {
				id = await new Promise(res => {
					randomBytes(10, (err, buf) => {
						if (err) return res()

						res(buf.toString('binary'))
					})
				})
			} catch { }
		} while (!id || this._resolver.has(id))

		return await new Promise((resolve, reject) => {
			this._resolver.set(id, {
				resolve,
				reject
			})

			worker.postMessage({
				id,
				data
			})
		})
	}

	async spawn() {
		if (this.length >= this._limit)
			return 0

		const worker = new Worker(
			this._options.filename,
			this._options
		)

		this._workers.push(worker)

		worker.on('message', obj => {
			if (!obj.id) {
				worker.ready = true

				this.emit('spawn', {
					worker: this._workers.indexOf(worker)
				})

				return
			}

			this.emit('data', obj)
		})

		worker.on('error', error => this.emit('error', {
			worker: this._workers.indexOf(worker),
			error
		}))

		worker.once('exit', code => {
			this.emit('exit', {
				worker: this._workers.indexOf(worker),
				code
			})

			this._workers.splice(
				this._workers.indexOf(worker),
				1
			)

			worker.removeAllListeners()
		})

		return 1
	}

	getWorker() {
		const filtered = this._workers.filter(w => w.ready)

		const len = filtered.length ? filtered.length : this.length

		if (len < 2)
			return filtered.length ? filtered[0] : this._workers[0]

		const random = Math.floor(Math.random() * len)

		return filtered.length ? filtered[random] : this._workers[random]
	}
}

module.exports = WorkerPool