module.exports = async d => {
    const {code} = d.util.openFunc(d);

    let ping

    if (d.client.db.roundTrip) {
        ping = await d.client.db.roundTrip()
    } else {
        ping = d.client.db.ping
    }

    return {
        code: d.util.setCode({function: d.func, code, result: ping})
    }
}