
const commandHandler = async (bot) => {
    await bot.managers.commands.load({ path: "./commands" });
}