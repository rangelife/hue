#!/usr/bin/env node

let huejay = require('huejay');

let username='homefucker-huejay';

let client;

huejay.discover()
.then(bridges => {
for (let bridge of bridges) {
  console.log(`Id: ${bridge.id}, IP: ${bridge.ip}`);
  return bridge.ip;
}
})
.catch(error => {
console.log(`An error occurred: ${error.message}`);
})
.then( function (ip) {
	client = new huejay.Client({
  		host:     ip
	});

	let user = new client.users.User;

	// Optionally configure a device type / agent on the user
	user.deviceType = 'homefucker'; // Default is 'huejay'

	return client.users.create(user);
})
.then(user => {
	console.log(`New user created - Username: ${user.username}`);
})
.catch(error => {
	if (error instanceof huejay.Error && error.type === 101) {
		return console.log(`Link button not pressed. Try again...`);
	}

	console.log(error.stack);
});
