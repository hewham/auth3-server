const winston = require("winston");
const figures = require("figures");
const colors = require("colors");

const { combine, timestamp, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => `${loglevel(level)} | ${timestamp} | ${messagelevel(message, level)}`);

const log = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: combine(
    timestamp({ format: 'MMM D | h:mm:ss A' }),
    myFormat
  ),
  transports: [
    new winston.transports.Console()
  ]
});

function loglevel(level) {
  level = level.toUpperCase();
  if (level == 'INFO') {
    return colors.cyan(figures.circleDouble);
  } else if (level == "DEBUG") {
    return colors.magenta(figures.questionMarkPrefix);
  } else if (level == "WARN") {
    return colors.yellow(figures.warning);
  } else if (level == "ERROR") {
    return colors.red(figures.checkboxCircleOn);
  }
}

function messagelevel(message, level) {
  level = level.toUpperCase();
  if (level == "WARN") {
    return colors.yellow(message);
  } else if (level == "ERROR") {
    return colors.red(message);
  } else {
    return message;
  }
}

module.exports = log;
