#!/bin/bash -e
location=$(pwd)
cat startup-script | sed 's|__LOCATION__|'$location'|' > /etc/init.d/hue
chmod 755 /etc/init.d/hue
update-rc.d hue defaults
