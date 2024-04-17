import fs from "node:fs";

export function open(
	path: string,
	flags: string,
	mode: number
): Promise<number> {
	return new Promise((resolve, reject) => {
		fs.open(path, flags, mode, (err, fd) => {
			if (err) {
				reject(err);
			} else {
				resolve(fd);
			}
		});
	});
}

export function close(fd: number): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.close(fd, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

export function read(
	fd: number,
	buffer: Buffer,
	offset: number,
	length: number,
	position: number
): Promise<{ bytesRead: number; buffer: Buffer }> {
	return new Promise((resolve, reject) => {
		fs.read(
			fd,
			buffer,
			offset,
			length,
			position,
			(err, bytesRead, buffer) => {
				if (err) {
					reject(err);
				} else {
					resolve({ bytesRead, buffer });
				}
			}
		);
	});
}

export function write(
	fd: number,
	buffer: Buffer,
	offset: number,
	length: number,
	position: number
): Promise<{ written: number; buffer: Buffer }> {
	return new Promise((resolve, reject) => {
		fs.write(
			fd,
			buffer,
			offset,
			length,
			position,
			(err, written, buffer) => {
				if (err) {
					reject(err);
				} else {
					resolve({ written, buffer });
				}
			}
		);
	});
}

export function readLine(fd: number) {
	let buffer = Buffer.alloc(1024);
	let line = "";
	let lineIndex = 0;
	let bytesRead = 0;

	return async function* () {
		while (true) {
			({ bytesRead, buffer } = await read(
				fd,
				buffer,
				0,
				1024,
				bytesRead
			));
			if (bytesRead === 0) {
				break;
			}

			for (let i = 0; i < bytesRead; i++) {
				if (buffer[i] === 0x0a) {
					yield line;
					line = "";
					lineIndex = 0;
				} else {
					line += String.fromCharCode(buffer[i]);
				}
			}
		}

		if (line.length > 0) {
			yield line;
		}
	};
}
