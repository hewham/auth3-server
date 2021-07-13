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

function getSourceColor(request_source) {
  if (request_source == "admin_dashboard") {
    return "yellow";
  } else if (request_source == "web_app") {
    return "cyan";
  } else if (request_source == "browser_extension") {
    return "green";
  } else if (request_source == "ios_app") {
    return "magenta";
  } else if (request_source == "android_app") {
    return "magenta";
  } else if (request_source != "unknown") {
    return "blue"; // API Webhooks
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
    const { request_source, req_src, req_site, req_version } = req.query;
    let reqSrc = "unknown";
    let reqSite = null;
    let appVersion = null;
    let reqUserID = null
    const serverVersion = server_version;

    // if theres a request_source OR rec_src param, format it
    request_source ? reqSrc = request_source : null;
    req_src ? reqSrc = req_src : null;
    req_site ? reqSite = req_site : null;
    req_version ? appVersion = req_version : null;
    req.userID ? reqUserID = req.userID : null;

    // remove request_source info from displayed url
    showURL.includes("request_source") ? showURL = showURL.substr(0, showURL.indexOf("request_source") - 1) : null;
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
