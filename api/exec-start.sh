cd /home/eoin/grid-paint/api || exit
/home/eoin/.nvm/versions/node/v14.18.1/bin/npm install
/usr/bin/mkdir ssl
/usr/bin/cp /etc/letsencrypt/live/api.0x30.in/privkey.pem /etc/letsencrypt/live/api.0x30.in/fullchain.pem ./ssl
NODE_ENV=production /home/eoin/.nvm/versions/node/v14.18.1/bin/node src/index.js
