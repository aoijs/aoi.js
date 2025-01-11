/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Transform } from 'node:stream';
import chalk from 'chalk';
import ora from 'ora';
import cliSpinners from 'cli-spinners';
import boxen from 'boxen';

const groups = {};
let parent = '';

const spinner = ora({
	spinner: cliSpinners.arc,
	text: 'Running tests...',
}).start();
let output = '';

const customReporter = new Transform({
	writableObjectMode: true,
	transform(event, _encoding, callback) {
		try {
<<<<<<< HEAD
=======
	

>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
			if (event.type === 'test:start') {
				if (event.data.nesting === 0) {
					groups[event.data.name] = {
						start: performance.now(),
						end: null,
						subtests: {},
						status: 'running',
					};
					parent = event.data.name;
				} else {
					groups[parent].subtests[event.data.name] = {
						start: performance.now(),
						end: null,
						status: 'running',
					};
				}
			}

<<<<<<< HEAD
			// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
			switch (event.type) {
				case 'test:enqueue':
					// output = chalk.blue(
					// 	`${kaomojiIcons.enqueue} Test enqueued: ${event.data.name}`,
					// );
					break;
				case 'test:dequeue':
					// output = chalk.yellow(
					// 	`${kaomojiIcons.dequeue} Test dequeued: ${event.data.name}`,
					// );
					break;
				case 'test:start':
					// group[parent] = true;
					break;
				case 'test:pass':
					if (event.data.nesting === 0) {
						groups[event.data.name].end = performance.now();
<<<<<<< HEAD
						groups[event.data.name].status = event.data.todo ? 'todo' : event.data.skip ? 'skipped' : 'passed';
=======
						groups[event.data.name].status = 'passed';
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
					} else {
						groups[parent].subtests[event.data.name].end =
							performance.now();
						groups[parent].subtests[event.data.name].status =
<<<<<<< HEAD
							event.data.todo ? 'todo' : event.data.skip ? 'skipped' : 'passed';
=======
							'passed';
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
					}

					break;
				case 'test:fail':
					if (event.data.nesting === 0) {
						groups[event.data.name].end = performance.now();
<<<<<<< HEAD
						groups[event.data.name].status = event.data.todo ? 'todo' : event.data.skip ? 'skipped' : 'failed';
=======
						groups[event.data.name].status = 'failed';
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
					} else {
						groups[parent].subtests[event.data.name].end =
							performance.now();
						groups[parent].subtests[event.data.name].status =
<<<<<<< HEAD
							event.data.todo ? 'todo' : event.data.skip ? 'skipped' : 'failed';
=======
							'failed';
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
					}

					break;
				case 'test:plan':
					// output = chalk.magenta('Test plan executed');
					break;
<<<<<<< HEAD
				case 'test:watch:drained': {
					process.exit(0);
				}

=======
				case 'test:watch:drained':
					break;
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
				case 'test:coverage': {
					break;
				}

				case 'test:diagnostic':
				case 'test:stderr':
				case 'test:stdout':
					output += chalk.gray(event.data.message) + '\n';
					break;
<<<<<<< HEAD
				case 'test:summary':
					break;
=======
				default: {
					throw new Error('default case');
				}
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
			}

			if (output) {
				// this.push(`${output}\n`);
				if (output.includes('duration')) {
					// loop through groups and print them in boxen subtests are padded left more to give tree structure
					let boxoutput = '\n';
					Object.keys(groups).forEach((group) => {
						const { start, end, status, subtests } = groups[group];
						const duration = (end - start).toFixed(2);
						let subtestoutput = '';
						Object.keys(subtests).forEach((subtest) => {
							const { start, end, status } = subtests[subtest];
							const duration = (end - start).toFixed(2);
<<<<<<< HEAD
							subtestoutput += `${
								status === 'passed'
									? chalk.green('✔')
									: status === 'failed'
										? chalk.red('✘')
										: status === 'todo'
											? chalk.yellow('○')
											// skip emoji / fonticon
											: chalk.blue('>>')
							} ${subtest} (${duration}ms)\n`;
						});
						boxoutput += boxen(`${subtestoutput}`, {
							padding: { left: 2, right: 8 },
							title: `${
								status === 'passed'
									? chalk.green('✔')
									: status === 'failed'
										? chalk.red('✘')
										: status === 'todo'
											? chalk.yellow('○')
											// skip emoji / fonticon
											: chalk.blue('>>')
							} ${group} (${duration}ms)`,
=======
							subtestoutput += `${status === 'passed' ? chalk.green('✔') : chalk.red('✘')} ${subtest} (${duration}ms)\n`;
						});
						boxoutput += boxen(`${subtestoutput}`, {
							padding: { left: 2, right: 8 },
							title: `${status === 'passed' ? chalk.green('✔') : chalk.red('✘')} ${group} (${duration}ms)`,
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
						});
						boxoutput += '\n';
					});

					this.push(boxoutput);
					this.push('\n');
					this.push(output + '\n');

<<<<<<< HEAD
					output = '';

=======
>>>>>>> 9d1637b2e80d4bcbd055ccc60a53aa9f1c178bcb
					setTimeout(() => {
						spinner.stopAndPersist({
							symbol: '★',
							text: chalk.green('All tests complete!'),
						});

						process.exit(0);
					}, 10);
				}
			}

			// Stop spinner when all tests are done
			if (event.type === 'test:watch:drained') {
				spinner.stopAndPersist({
					symbol: '★',
					text: chalk.green('All tests complete!'),
				});
			}

			callback();
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
	},
});

export default customReporter;
