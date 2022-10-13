const { red, green, grey, blue, yellow, black, bold } = require("chalk");
const chalk = require('chalk')
const dateTime = require("node-datetime");
const dt = dateTime.create();
const fs = require("fs");
const formatted = dt.format("Y-m-d H:M:S");
const debug = function (text) {
  console.debug(
    `${grey(`${formatted}`)} || ${chalk.bgBlue("[ DEBUG ]")} ${grey(" :: ")} ${green(
      `${text}`
    )}`
  );
  fs.readFile("/root/home/Nova/logs/debug.log", "utf8", (err, data) => {
    var abc = fs.createWriteStream(`/root/home/Nova/logs/debug.log`);
    abc.write(`${data} \n`);
    abc.write(`${formatted} || [ DEBUG ] :: ${text}`);
    abc.write(
      "< - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - > \n"
    );
    abc.end();
  });
};

const error = function (text) {
  console.error(
    `${black(`${formatted} ||`)} ${chalk.bgRed("[ ERROR ]")} ${grey(" :: ")} ${red(
      `${text}`
    )}`
  );
  fs.readFile("/root/home/Nova/logs/error.log", "utf8", (err, data) => {
    var abc = fs.createWriteStream(`/root/home/Nova/logs/error.log`);
    abc.write(`${data} \n`);
    abc.write(`${formatted} || [ ERROR ] :: ${text}`);
    abc.write(
      "< - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - > \n"
    );
    abc.end();
  });
};

const warn = function (text) {
  console.warn(
    `${black(`${formatted} ||`)} ${chalk.bgYellow("[ WARNING ]")} ${grey(
      " :: "
    )} ${yellow(`${text}`)}`
  );
  fs.readFile("/root/home/Nova/logs/warnings.log", "utf8", (err, data) => {
    var abc = fs.createWriteStream(`/root/home/Nova/logs/warning.log`);
    abc.write(`${data} \n`);
    abc.write(`${formatted} || [ WARNING ] :: ${text}`);
    abc.write(
      "< - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - > \n"
    );
    abc.end();
  });
};

module.exports = {
  debug,
  error,
  warn,
};
