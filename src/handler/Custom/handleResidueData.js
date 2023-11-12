async function handleResidueData(client) {
    const db = client.db;
    await client.db.deleteMany("__aoijs_vars__", (data) => {
        const key = data.id.split("_")[0];
        if (key === "cooldown" && data.value < Date.now()) return true;
    });
}

module.exports = handleResidueData;
