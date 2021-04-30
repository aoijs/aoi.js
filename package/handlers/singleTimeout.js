const ms = require("ms") 

module.exports = async (client, data) => {
	const max = ms('21d');
	
	if (data.expiresAt - Date.now() > max) return;
	
	var repeater;

	if (data.repeatEvery) {
		repeater = setInterval(() => {
			client.emit('timeoutPulse', data);
		}, data.repeatEvery);
	}

	setTimeout(() => {
		if (repeater) clearInterval(repeater);

		client.emit('timeoutExpire', data);

		client.db.delete("main", `timeout_${data.id}`)
	}, data.expiresAt - Date.now());
};
