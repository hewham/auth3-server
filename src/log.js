const winston = require("winston");
require('winston-syslog');
const figures = require("figures");
const colors = require("colors");

const enable_papertrail = (process.env.PT_ENABLED == "true");
const papertrail_options = {
  host: process.env.PT_HOST,
  port: process.env.PT_PORT,
  app_name: process.env.PT_APPNAME,
  localhost: process.env.PT_HOSTNAME,
  colorize: true
};

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

if (enable_papertrail) {
  log.add(new winston.transports.Syslog(papertrail_options));
}

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
