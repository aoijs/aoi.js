async function handleResidueData(client) {
    await client.db.deleteMany("__aoijs_vars__", (data) => {
        const key = data.key.split("_")[0];
        if (key === "cooldown" && data.value < Date.now()) return true;
    });
}

module.exports = handleResidueData;
