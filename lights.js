#!/usr/bin/env node

let huejay = require('huejay');

let username = process.env.HUE_USERNAME;

let ip;// = '192.168.0.6';

let action;

switch(process.argv[2]) {
	case 'on': action=true; break;
	case 'off': action=false; break;
}
let client;

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
})
.then( function (x) {
	return client.users.get();
})
.then(user => {
	console.log('Username:', user.username);
	console.log('Device type:', user.deviceType);
	console.log('Create date:', user.created);
	console.log('Last use date:', user.lastUsed);
	console.log('');
})
// .then( function (x) {
// 	return client.users.getAll();
// })
// .then(users => {
// 	for (let user of users) {
// 		console.log('Username:', user.username);
// 		console.log('Device type:', user.deviceType);
// 		console.log('Create date:', user.created);
// 		console.log('Last use date:', user.lastUsed);
// 	}
// });

// .then( function (x) {
// 	return client.lights.getAll()
//   .then(lights => {
//     for (let light of lights) {
//       console.log(`Light [${light.id}]: ${light.name}`);
//       console.log(`  Type:             ${light.type}`);
//       console.log(`  Unique ID:        ${light.uniqueId}`);
//       console.log(`  Manufacturer:     ${light.manufacturer}`);
//       console.log(`  Model Id:         ${light.modelId}`);
//       console.log('  Model:');
//       console.log(`    Id:             ${light.model.id}`);
//       console.log(`    Manufacturer:   ${light.model.manufacturer}`);
//       console.log(`    Name:           ${light.model.name}`);
//       console.log(`    Type:           ${light.model.type}`);
//       console.log(`    Color Gamut:    ${light.model.colorGamut}`);
//       console.log(`    Friends of Hue: ${light.model.friendsOfHue}`);
//       console.log(`  Software Version: ${light.softwareVersion}`);
//       console.log('  State:');
//       console.log(`    On:         ${light.on}`);
//       console.log(`    Reachable:  ${light.reachable}`);
//       console.log(`    Brightness: ${light.brightness}`);
//       console.log(`    Color mode: ${light.colorMode}`);
//       console.log(`    Hue:        ${light.hue}`);
//       console.log(`    Saturation: ${light.saturation}`);
//       console.log(`    X/Y:        ${light.xy[0]}, ${light.xy[1]}`);
//       console.log(`    Color Temp: ${light.colorTemp}`);
//       console.log(`    Alert:      ${light.alert}`);
//       console.log(`    Effect:     ${light.effect}`);
//       console.log();
//     }
//   });
// })



// .then( function (x) {
// 	return client.scenes.getAll()
//   .then(scenes => {
//     for (let scene of scenes) {
//       console.log(`Scene [${scene.id}]: ${scene.name}`);
//       console.log('  Lights:', scene.lightIds.join(', '));
//       console.log();
//     }
//   });
// })


// .then( function (x) {
// 	return client.scenes.recall('5Cw6SrNx8M9nKMh')
//   .then(() => {
//     console.log('Scene was recalled');
//   })
//   .catch(error => {
//     console.log(error.stack);
//   });

// })

.then( function (x) {
	return client.rules.getAll()
  .then(rules => {
    for (let rule of rules) {
      console.log(`Rule [${rule.id}]: ${rule.name}`);
      console.log(`  Created:         ${rule.created}`);
      console.log(`  Last Triggered:  ${rule.lastTriggered}`);
      console.log(`  Times Triggered: ${rule.timesTriggered}`);
      console.log(`  Owner:           ${rule.owner}`);
      console.log(`  Status:          ${rule.status}`);

      console.log(`  Conditions:`);
      for (let condition of rule.conditions) {
        console.log(`    Address:  ${condition.address}`);
        console.log(`    Operator: ${condition.operator}`);
        console.log(`    Value:    ${condition.value}`);
        console.log();
      }

      console.log(`  Actions:`);
      for (let action of rule.actions) {
        console.log(`    Address: ${action.address}`);
        console.log(`    Method:  ${action.method}`);
        console.log(`    Body:    ${JSON.stringify(action.body)}`);
        console.log();
      }

      console.log();
    }
  });
})



.then( function (x) {
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
})
