module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [id] = data.inside.splits;

    const timeout = await d.client.db.get(
        d.client.db.tables[0],
        "setTimeout",
        id,
    );
    if (!timeout) return d.error(`Timeout with ID: ${id} not found.`);

    timeout.value.__timeoutIds__.forEach((x) => clearTimeout(x));
    timeout.value.__pulseIds__?.forEach((x) => clearInterval(x));

    await d.client.db.delete(d.client.db.tables[0], "setTimeout", id);

    return {
        code: d.util.setCode(data),
    };
};