const chalk = require('chalk');

function createCustomBoxedMessage(messages, borderColor = 'yellow', title = null) {
    if (!Array.isArray(messages)) {
        messages = [messages];
    }

    const maxLength = title
        ? Math.max(...messages.map(msg => msg.text.length), title.text.length)
        : Math.max(...messages.map(msg => msg.text.length));

    const topBorder = chalk[borderColor](`╭${'─'.repeat(maxLength + 2)}╮`);
    const bottomBorder = chalk[borderColor](`╰${'─'.repeat(maxLength + 2)}╯`);

    console.log(topBorder);

    if (title) {
        const titlePadding = ' '.repeat((maxLength - title.text.length) / 2);
        const titleText = `${chalk[borderColor]('│')} ${titlePadding}${chalk[title.textColor](title.text)}${titlePadding} ${chalk[borderColor]('│')}`;
        console.log(titleText);
    }

    messages.forEach((message, index) => {
        const padding = ' '.repeat(maxLength - message.text.length);
        const textColor = message.textColor || 'reset'; // Default to reset color if not specified
        const messageText = `${chalk[borderColor]('│')} ${chalk[textColor](message.text)}${padding} ${chalk[borderColor]('│')}`;
        console.log(messageText);
    });

    console.log(bottomBorder);
}

module.exports = createCustomBoxedMessage;
