/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [method = "process"] = data.inside.splits;

    if (!["process", "os"].includes(method)) {
        return d.aoiError.fnError(d, "option", {inside: data.inside});
    }

        const initial = process.cpuUsage();

        if (method === "process") {
            const start = Date.now();

            if ((start - (d.client.aoiOptions.cpu?.time || 0)) > 5000) {
                while (Date.now() - start > 1) ;
                const final = process.cpuUsage(initial);
                data.result = ((final.user + final.system) / 1000).toFixed(2);
                d.client.aoiOptions.cpu = {
                    time: start,
                    usage: data.result
                };
            } else {
                data.result = d.client.aoiOptions.cpu?.usage;
            }
        } else {
            const cpus = require('os').cpus();
            const avgs = cpus.map(cpu => {
                const total = Object.values(cpu.times).reduce((a, b) => a + b);
                const nonIdle = total - cpu.times.idle;
                return nonIdle / total;
            });
            data.result = (avgs.reduce((a, b) => a + b) / cpus.length).toFixed(2);
        }

        return {
            code: d.util.setCode(data)
    }
};
