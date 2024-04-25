import fs from 'node:fs';

/**
 * Open a file and return a file descriptor
 * @param path - Path to the file
 * @param flags - Flags to open the file with
 * @param mode - Mode to open the file with
 * @example
 * ```ts
 * const fd = await open('file.txt', 'r', 0o666);
 * ```
 * @returns File descriptor
 */
export async function open(
	path: string,
	flags: string,
	mode: number,
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

/**
 * Close a file descriptor
 * @param fd - File descriptor
 * @example
 * ```ts
 * await close(fd);
 * ```
 * @returns
 */
export async function close(fd: number): Promise<void> {
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

/**
 * Read from a file descriptor
 * @param fd - File descriptor
 * @param buffer - Buffer to read into
 * @param offset - Offset to start reading at
 * @param length - Number of bytes to read
 * @param position - Position to read from
 * @example
 * ```ts
 * const { bytesRead, buffer } = await read(fd, buffer, 0, 1024, 0);
 * ```
 * @returns Object containing the number of bytes read and the buffer
 */
export async function read(
	fd: number,
	buffer: Uint8Array,
	offset: number,
	length: number,
	position: number,
): Promise<{ bytesRead: number; buffer: Uint8Array }> {
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
			},
		);
	});
}

/**
 * Write to a file descriptor
 * @param fd - File descriptor
 * @param buffer - Buffer to write from
 * @param offset - Offset to start writing from
 * @param length - Number of bytes to write
 * @param position - Position to write to
 * @example
 * ```ts
 * const { written, buffer } = await write(fd, buffer, 0, 1024, 0);
 * ```
 * @returns Object containing the number of bytes written and the buffer
 */
export async function write(
	fd: number,
	buffer: Uint8Array,
	offset: number,
	length: number,
	position: number,
): Promise<{ written: number; buffer: Uint8Array }> {
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
			},
		);
	});
}

/**
 * Read a file line by line
 * @param fd - File descriptor
 * @example
 * ```ts
 * for await (const line of readLine(fd)) {
 * 	console.log(line);
 * }
 * ```
 * @returns Async generator that yields lines from the file
 */
export function readLine(fd: number): () => AsyncGenerator<string> {
	let buffer = new Uint8Array(1024);
	let line = '';
	let lineIndex = 0;
	let bytesRead = 0;

	return async function* () {
		while (true) {
			({ bytesRead, buffer } = await read(
				fd,
				buffer,
				0,
				1024,
				bytesRead,
			));
			if (bytesRead === 0) {
				break;
			}

			for (let i = 0; i < bytesRead; i++) {
				if (buffer[i] === 0x0a) {
					yield line;
					line = '';
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
