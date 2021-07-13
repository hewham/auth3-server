// logs every request
const log = require("../log");
const figures = require("figures");
const colors = require("colors");
const server_version = require('../../package.json').version;

function getMethodColor(method) {
  if (method == "GET") {
    return "green";
  } else if (method == "POST") {
    return "yellow";
  } else if (method == "PUT") {
    return "magenta";
  } else if (method == "DELETE") {
    return "red";
  } else {
    return defaultColor;
  }
}

function getSourceColor(rec_src) {
  if (rec_src == "demo") {
    return "magenta";
  } else {
    return "gray"; // unknown
  }
}

module.exports = async (req, res, next) => {
  if (
    // Don't log conditions
    req.method == "OPTIONS"
    || req.url.substr(0, 7) == "/health"
    || req.url.substr(0, 8) == "/v1/docs"
  ) {
    next();
  } else {
    // Log formatter
    let showURL = req.url;
    const { req_src, req_site, req_version } = req.query;
    let reqSrc = "unknown";
    let reqSite = null;
    let appVersion = null;
    let reqUserID = null;
    const serverVersion = server_version;

    // if theres a rec_src OR rec_src param, format it
    req_src ? reqSrc = req_src : null;
    req_site ? reqSite = req_site : null;
    req_version ? appVersion = req_version : null;
    req.userID ? reqUserID = req.userID : null;

    // remove rec_src info from displayed url
    showURL.includes("req_src") ? showURL = showURL.substr(0, showURL.indexOf("req_src") - 1) : null;

    // assign colors based on request
    const methodColor = getMethodColor(req.method);
    const sourceColor = getSourceColor(reqSrc);

    const formattedReqSrc = reqSrc.replace('_', ' ');

    log.info(
      colors[sourceColor](figures.arrowRight + " V1")
      + " ["
      + colors[methodColor](req.method)
      + "] Request from "
      + colors[sourceColor](formattedReqSrc)
      + " for "
      + colors[sourceColor](showURL)
    );

    next();
  }
};
