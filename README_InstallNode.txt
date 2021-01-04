tar -xf node-v7.10.1-linux-armv7l.tar.gz
sudo mv node-v7.10.1-linux-armv7l /usr/local/node
cd /usr/bin
sudo ln -s /usr/local/node/bin/node node
sudo ln -s /usr/local/node/bin/npm npm
node -v  # Verifying that the Node.js install worked
npm -v   # Verifying that the npm install worked
