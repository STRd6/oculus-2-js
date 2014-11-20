#!/usr/bin/env node

var hmd = require("node-hmd"),
	express = require("express"),
	http = require("http");

var argv = require('optimist')
	.usage('Usage: $0 -d [driver]')
    .default('d', 'default')
    .alias('d', 'driver')
    .describe('d', 'Driver to load');

argv.showHelp(console.info);

// Create HMD manager object
console.info("Attempting to load node-hmd driver: " + argv.argv.driver);
var manager = hmd.createManager(argv.argv.driver);
if(typeof(manager) === "undefined") {
	console.error("Unable to load driver: " + argv.argv.driver);
	process.exit(1);
}
// Instantiate express server
var app = express();
app.set('port', process.env.PORT || 3000);

// Set up request routing
app.get("/", function (req, res) {
	res.sendfile(__dirname + "/index.html");
});

app.get("/supported", function (req, res) {
	res.json(hmd.getSupportedDevices());
});

app.get("/info", function (req, res) {
	manager.getDeviceInfo(function(err, deviceInfo) {
		res.json(deviceInfo);
	});
});

app.get("/orientation", function (req, res) {
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

	manager.getDeviceOrientation(function(err, deviceOrientation) {
		res.json(deviceOrientation);
	});
});

// Launch express server
http.createServer(app).listen(app.get("port"), function () {
	console.log("Express server listening on port " + app.get("port"));
});
