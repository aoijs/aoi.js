import { safe } from './core.js';

export function isValidTimeZone(timezone: string) {
	const exec = safe(() =>
		Intl.DateTimeFormat(undefined, { timeZone: timezone }),
	);
	return exec.success;
}

export function isValidDateLocale(locale: string) {
	const exec = safe(() => Intl.DateTimeFormat(locale));
	return exec.success;
}

export function humanizeMs(ms: number) {
	// 1y 2m 2w 4d 5h 6m 7s 8ms
	const time = {
		year: 0,
		month: 0,
		week: 0,
		day: 0,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0,
	};

	time.year = Math.floor(ms / 31536000000);
	ms -= time.year * 31536000000;
	time.month = Math.floor(ms / 2592000000);
	ms -= time.month * 2592000000;
	time.week = Math.floor(ms / 604800000);
	ms -= time.week * 604800000;
	time.day = Math.floor(ms / 86400000);
	ms -= time.day * 86400000;
	time.hour = Math.floor(ms / 3600000);
	ms -= time.hour * 3600000;
	time.minute = Math.floor(ms / 60000);
	ms -= time.minute * 60000;
	time.second = Math.floor(ms / 1000);
	ms -= time.second * 1000;
	time.millisecond = ms;

	const timeString = Object.entries(time)
		.filter((val) => val[1] !== 0)
		.map((val) => `${val[1]}${val[0].charAt(0)}`)
		.join(' ');

	return timeString;
}

export function formatTime(
	time: string | number,
	timezone: string,
	locale: string,
) {
	if (typeof time === 'string') {
		let format = '';
		let ms = 0;

		time.split(' ').forEach((val) => {
			if (val.includes('y')) {
				const num = parseInt(val.replace('y', ''));
				ms += num * 31536000000;
				format += `${pluralize(num, 'year')} `;
			} else if (
				val.includes('m') &&
				!['ms', 'min'].some((x) => val.includes(x))
			) {
				const num = parseInt(val.replace('m', ''));
				ms += num * 2592000000;
				format += `${pluralize(num, 'month')} `;
			} else if (val.includes('w')) {
				const num = parseInt(val.replace('w', ''));
				ms += num * 604800000;
				format += `${pluralize(num, 'week')} `;
			} else if (val.includes('d')) {
				const num = parseInt(val.replace('d', ''));
				ms += num * 86400000;
				format += `${pluralize(num, 'day')} `;
			} else if (val.includes('h')) {
				const num = parseInt(val.replace('h', ''));
				ms += num * 3600000;
				format += `${pluralize(num, 'hour')} `;
			} else if (val.includes('min')) {
				const num = parseInt(val.replace('min', ''));
				ms += num * 60000;
				format += `${pluralize(num, 'minute')} `;
			} else if (val.includes('s') && !val.includes('ms')) {
				const num = parseInt(val.replace('s', ''));
				ms += num * 1000;
				format += `${pluralize(num, 'second')} `;
			}
		});

		return {
			format: format.trim(),
			ms,
		};
	} else {
		const date = new Date(time);
		return {
			format: date.toLocaleString(locale, { timeZone: timezone }),
			ms: date.getTime(),
		};
	}
}

export function pluralize(num: number, txt: string, suffix = 's') {
	return `${num} ${txt}${num !== 1 ? suffix : ''}`;
}
