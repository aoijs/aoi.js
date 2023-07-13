module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();

    const [method = "process"] = inside.splits;
    let result;


    if (!["process", "os"].includes(method)) return d.aoiError.fnError(d, "option", {inside});

    const initial = process.cpuUsage();
    if (method === "process") {
        const start = Date.now();
        if ((start - (d.client.aoiOptions.cpu?.time || 0)) > 5000) {
            while (Date.now() - start > 1) ;
            const final = process.cpuUsage(initial);
            result = ((final.user + final.system) / 1000).toFixed(2);
            d.client.aoiOptions.cpu = {
                time: start,
                usage: result
            }
        } else {
            result = d.client.aoiOptions.cpu?.usage;
        }
    } else {
        const cpus = require('os').cpus();
        const avgs = cpus.map(cpu => {
            const total = Object.values(cpu.times).reduce((a, b) => a + b);
            const nonIdle = total - cpu.times.idle;
            return nonIdle / total
        });
        result = (avgs.reduce((a, b) => a + b) / cpus.length).toFixed(2);
    }

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}