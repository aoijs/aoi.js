class Time {
    static format(time) {
        const date = (t, ms) => Math.trunc(t / ms)
        const data = {
            object: {
                years: date(time, 31536000000),
                months: date(time, 2628002880) % 12,
                weeks: date(time, 604800000) % 4,
                days: date(time, 86400000) % 30,
                hours: date(time, 3600000) % 24,
                minutes: date(time, 60000) % 60,
                seconds: date(time, 1000) % 60,
                ms: date(time, 1) % 1000
            },

        }
        data.humanize = () => {
            const string = []
            Object.entries(data.object).forEach(x => {
                if (!x[1]) { }
                else {
                    if (["months", "ms"].includes(x[0])) {
                        string.push(`${x[1]}${x[0].slice(0, 3)}`)
                    }
                    else {
                        string.push(`${x[1]}${x[0].slice(0, 1)}`)
                    }
                }
            });
            return string.join(" ");
        }
        data.toString = () => this.parse(data.humanize()).format
        return data
    }
    static parse(time) {

        if (!["string", "number"].includes(typeof time)) throw TypeError("Time Must Be A String Or Number");
        if (typeof time === "number") return this.format(time).humanize()
        else {
            const Hash = new Map();

            time.split(" ").forEach(x => {

                if (x.endsWith("y")) Hash.set("y", { format: `${Number(x.split("y")[0])} Year(s)`, ms: Number(x.split("y")[0]) * 31536000000, order: 1 });
                if (x.endsWith("mon") || x.endsWith("M")) Hash.set("mon", { format: `${Number(x.split("mon")[0].split("M")[0])} Month(s)`, ms: Number(x.split("mon")[0].split("M")[0]) * 2628002880, order: 2 });
                if (x.endsWith("w")) Hash.set("w", { format: `${Number(x.split("w")[0])} Week(s)`, ms: Number(x.split("w")[0]) * 604800000, order: 3 });
                if (x.endsWith("d")) Hash.set("d", { format: `${Number(x.split("d")[0])} Day(s)`, ms: Number(x.split("d")[0]) * 86400000, order: 4 });
                if (x.endsWith("h") || x.endsWith("hr")) Hash.set("h", { format: `${Number(x.split("h")[0].split("hr")[0])} Hour(s)`, ms: Number(x.split("hr")[0].split("h")[0]) * 3600000, order: 5 });
                if (x.endsWith("min") || x.endsWith("m")) Hash.set("min", { format: `${Number(x.split("min")[0].split("m")[0])} Minute(s)`, ms: Number(x.split("min")[0].split("m")[0]) * 60000, order: 6 });
                if (x.endsWith("s") && !x.endsWith("ms")) Hash.set("s", { format: `${Number(x.split("s")[0])} Seconds`, ms: Number(x.split("s")[0]) * 1000, order: 7 });
                if (x.endsWith("ms")) Hash.set("ms", { format: `${Number(x.split("ms")[0])} Milli Seconds`, ms: Number(x.split("ms")[0]), order: 8 });
            });
            const data = [...Hash.values()].sort(compare);

            const ms = data.map(x => x.ms).reduce((a, b) => a + b);
            const format = data.map(x => x.format).join(" ");

            return {
                ms,
                format
            }
        }
    }
}
module.exports = {
    Time
}

//useless Functions 
function compare(a, b) {
    if (a.order < b.order) {
        return -1;
    }
    if (a.order > b.order) {
        return 1;
    }
    return 0;
}