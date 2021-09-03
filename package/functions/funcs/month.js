module.exports = async d => {
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Desember']

	return {
		code: d.command.code.replaceLast("$month", months[new Date(new Date().toLocaleString('en-US', {
			timeZone: d.timezone
		})).getMonth()])
	}
}