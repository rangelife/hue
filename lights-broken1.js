#!/usr/bin/env node

var hue = require("node-hue-api");

var HueApi = require("node-hue-api").HueApi;

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var username = "08a902b95915cdd9b75547cb50892dc4",
    api;

hue.nupnpSearch()
.then( function (bridge) {
	console.log("Hue Bridges Found: " + JSON.stringify(bridge));
	api = new HueApi(bridge.ipaddress, username);

	// --------------------------
	// Using a promise
	return api.config();
})
.then(displayResult)
.done();