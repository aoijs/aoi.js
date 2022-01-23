module.exports = async d => {
    const {code} = d.util.openFunc(d);
    const ping = d.client.db.roundTrip ? await d.client.db.roundTrip() : d.client.db.ping

    return {
        code: d.util.setCode({function: d.func, code, result: ping})
    }
}