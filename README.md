# one-off installation on pi

run `sudo install_on_pi.sh` (look what it does first)

then `sudo service hue start`

the session gets stale so you may wish to use 'sudo crontab -e' to add a crontab entry '0 0 * * * /usr/sbin/service hue restart' to restart it at midnight



# additions and improvements

do experiments on lights.js

then move the logic into backend.js which is the server responding to REST calls

