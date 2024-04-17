import fsPromises from 'node:fs/promises';
import fs from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { Group } from '@akarui/structures';
import { DataType } from './typings.js';
import { close, read, readLine, write } from '../utils/promisifyFd.js';

export default class TextFile {
	#file: string;
	#tempFile: string;
	#locked = false;
	#type: DataType = 'str:1024';
	#fd: number | null = null;
	#lineoffsets: number[] = [];
	#queue: { fn: () => void }[] = [];
	#retries = 0;
	constructor(path: string, type: DataType) {
		this.#file = path;
		this.#type = type;
		this.#tempFile = join(dirname(path), `.${basename(path)}.tmp`);
		fs.open(
			this.#file,
			fs.constants.O_CREAT | fs.constants.O_RDWR,
			0o666,
			(err, fd) => {
				if (err) {
					throw err;
				}
				this.#fd = fd;
			},
		);
	}

	async write(
		position: number,
		data: Buffer,
		bufferStartOffset = 0,
		bufferEndOffset = data.length,
	): Promise<{ written: number; buffer: Buffer }> {
		if (this.#locked) {
			await new Promise((resolve) => {
				this.#queue.push({
					fn: () => {
						this.write(
							position,
							data,
							bufferStartOffset,
							bufferEndOffset,
						).then(resolve);
					},
				});
			});
		}
		this.#locked = true;
		try {
			const { written, buffer } = await write(
				this.#fd!,
				data,
				bufferStartOffset,
				bufferEndOffset,
				position,
			);
			return { written, buffer };
		} finally {
			this.#locked = false;
			const next = this.#queue.shift();
			if (next) {
				next.fn();
			}
		}
	}

	async read(
		position: number,
		length: number,
		buffer: Buffer,
		bufferStartOffset = 0,
	) {
		if (this.#locked) {
			return await new Promise((resolve) => {
				this.#queue.push({
					fn: () => {
						this.read(
							position,
							length,
							buffer,
							bufferStartOffset,
						).then(resolve);
					},
				});
			});
		}
		this.#locked = true;
		try {
			return (
				await read(
					this.#fd!,
					buffer,
					bufferStartOffset,
					length,
					position,
				)
			)?.buffer;
		} finally {
			this.#locked = false;
			const next = this.#queue.shift();
			if (next) {
				next.fn();
			}
		}
	}

	async close() {
		await close(this.#fd!);
	}

	async unlink() {
		await this.close();
		await fsPromises.unlink(this.#file);
		await fsPromises.unlink(this.#tempFile);
	}

	async getOffsets() {
		this.#lineoffsets = [0];
		const grp = new Group(Infinity);
		for await (const line of readLine(this.#fd!)()) {
			const newoffset =
				(this.#lineoffsets.at(-1) as number) + line.length + 2;
			this.#lineoffsets.push(newoffset);

			if (this.#type === 'bool') {
			}
		}
	}
}
