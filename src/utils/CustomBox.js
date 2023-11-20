const chalk = require('chalk');

function createCustomBoxedMessage(
  messages,
  borderColor = "yellow",
  title = null
) {
  if (!Array.isArray(messages)) {
    messages = [messages];
  }

  const maxLength = title
    ? Math.max(...messages.map((msg) => msg.text.length), title.text.length)
    : Math.max(...messages.map((msg) => msg.text.length));

  const topBorder = chalk[borderColor](`╭${"─".repeat(maxLength + 2)}╮`);
  const bottomBorder = chalk[borderColor](`╰${"─".repeat(maxLength + 2)}╯`);

  console.log(topBorder);

  if (title) {
    const titlePadding = " ".repeat((maxLength - title.text.length) / 2);
    const titleText = `${chalk[borderColor]("│")} ${titlePadding}${chalk[
      title.textColor
    ](title.text)}${titlePadding} ${chalk[borderColor]("│")}`;
    console.log(titleText);
  }

  messages.forEach((message, index) => {
    const paddingLength = (maxLength - message.text.length) / 2;
    const leftPadding = " ".repeat(Math.floor(paddingLength));
    const rightPadding = " ".repeat(Math.ceil(paddingLength));
    const textColor = message.textColor || "reset";
    const messageText = `${chalk[borderColor]("│")} ${leftPadding}${chalk[
      textColor
    ](message.text)}${rightPadding} ${chalk[borderColor]("│")}`;
    console.log(messageText);
  });

  console.log(bottomBorder);
}

module.exports = createCustomBoxedMessage;
