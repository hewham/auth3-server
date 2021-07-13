// Set server timezone
process.env.TZ = "America/Detroit";
const version = require("../package.json").version;

// Set environment
require("dotenv").config({
  path: (process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production") ? "./.env.prod" : "./.env.dev"
});

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

// const firebaseAdmin = require('firebase-admin');

// Provides visual icons for logs in command line
const figures = require("figures");
const colors = require("colors");
const log = require("./log");
const requestLogger = require("./scripts/requestLogger");

// const startup = require("./meta/startup");
// const { oauth2Security, authorizationErrorHandler } = require("./security/oauth2Middleware");
// const authLookup = require("./meta/authLookup");
// const swagger = require("./docs/swagger.js");


const ServiceRegistry = require('./api/services/registry');
var db = require('./db/models');

const v1Routes = {
  "users": require("./api/routes/users"),
  "auth": require("./api/routes/auth")
};

// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.applicationDefault()
// });

// this runs cron for notifications
// const cronRoute = require("./api/apps/cronSchedule");
// cronRoute.notifications();

/*
  APP START
  app is main express server
  /apps is for external integrations
*/

ServiceRegistry.initialize(db);

const app = express();
const APIS = {
  v1: express()
};

// This allows the use of bodyParser (for accessing request data)
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
APIS.v1.use(bodyParser.json({ limit: '100mb' }));
APIS.v1.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// lookup roles, lookup req user
// app.use(authLookup);

// Used by devs confirm that requests are activated
app.use(requestLogger);

// Set cors for all sub apis
app.use(cors());
Object.keys(APIS).forEach((apiKey) => {
  APIS[apiKey].use(cors());
});

// Health check endpoint
app.get("/health", (req, res) => res.status(200).send({ status: 200 }));

// Add v1 apis to v1 subapi
Object.keys(v1Routes).forEach((key) => APIS.v1.use("/" + key, v1Routes[key]));

// Set up swagger docs endpoint
// APIS.v1 = swagger(APIS.v1);

// mount all sub apis in subdirs
Object.keys(APIS).forEach((key) => app.use("/" + key, APIS[key]));

// startup();
log.info(colors.cyan(figures.tick, " Server Started " + colors.blue("v" + version)));

module.exports = app;
