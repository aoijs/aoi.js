module.exports = async (d) => {
    d.client.destroy();
    process.exit();
};