#!/usr/bin/env node

var express = require('express');
//var cors = require('cors');
var Q = require('q');


var HTTP_PORT = 3888;

var app = express();
//app.use(cors());

var appJWT=undefined;

app.use("/", express.static('../frontend'));


let huejay = require('huejay');

let username = process.env.HUE_USERNAME;

let ip;// = '192.168.0.6';

let action;

switch(process.argv[2]) {
	case 'on': action=true; break;
	case 'off': action=false; break;
}
let client;

function log(str) {
	console.log(new Date()+": "+str);
}


log("Started with user name "+username);

let promise;
if (ip) {
	promise = Promise.resolve(ip);
} else {
	promise = huejay.discover()
	.then(bridges => {
		for (let bridge of bridges) {
	  		console.log(`Id: ${bridge.id}, IP: ${bridge.ip}`);
	  		return bridge.ip;
		}
	})
	.catch(error => {
		console.log(`An error occurred: ${error.message}`);
	});
}

promise.then( function (ip) {
	client = new huejay.Client({
  		host: ip,
  		username: username
	});
});

app.get('/off', function(req,res) {
	log('lights off requested..');

	allLights(false)
	.then( (results) => {
		log("off done");
		res.status(200).send('<body onload="window.location.href='+"'/off/result'"+'">');
	})
	.catch( function (err) {
		console.error(err);
		res.status(500).send({error: err});
	});
});

app.get('/off/result', function(req,res) {
	res.status(200).send('All lights turned off.');
});

app.get('/on', function(req,res) {
	log('lights on requested..');

	allLights(true)
	.then( (results) => {
		log("on done");
		res.status(200).send('<body onload="window.location.href='+"'/on/result'"+'">');
	})
	.catch( function (err) {
		console.error(err);
		res.status(500).send({error: err});
	});
});

app.get('/on/result', function(req,res) {
	res.status(200).send('All lights turned on.');
});

app.get('/scene/:scene', function(req,res) {
	console.log('scene requested..'+req.params.scene);

	scene(req.params.scene)
	.then( (results) => {
		log("scene "+req.params.scene+" done");
		res.status(200).send('<body onload="window.location.href='+"'/scene/"+req.params.scene+"/result'"+'">');
	})
	.catch( function (err) {
		console.error(err);
		res.status(500).send({error: err});
	});
});

app.get('/scene/:scene/result', function(req,res) {
	res.status(200).send('Scene activated: '+req.params.scene);
});

function allLights(action) {
	return client.groups.getById(0)
	.then(group => {
	    console.log('Special group 0');
	    console.log(JSON.stringify(group,0,4));
	    console.log('  Light Ids:', group.lightIds.join(', '));

	 	if (action !== undefined) {
		    group.on = action;
		    console.log(JSON.stringify(group,0,4));

		    return client.groups.save(group).then( function (x) {
				console.log("saved");
			});
		}
	});
}

function scene(target) {
	var actions=[];
	return client.scenes.getAll()
  	.then(scenes => {
	    for (let scene of scenes) {
	      if (target == scene.name) {
		      console.log(`Scene [${scene.id}]: ${scene.name}`);
		      console.log('  Lights:', scene.lightIds.join(', '));
		      console.log();
		      actions.push(client.scenes.recall(scene.id));
		  }
	    }
	})
	.then( function (x) {
		return Q.all(actions);
	});
}


app.listen(HTTP_PORT, function () {
  console.log('Example app listening on port '+HTTP_PORT);
});

