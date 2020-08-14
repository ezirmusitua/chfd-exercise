pushd ../../fabric-samples/first-network

sudo bash byfn.sh down -s couchdb -a -n -l node -o etcdraft
sudo bash byfn.sh generate -s couchdb -a -n -l node -o etcdraft
sudo bash byfn.sh up -s couchdb -a -n -l node -o etcdraft
sudo cp connection-org1.json ../../chfd-exercise/configs
sudo cp -r crypto-config ../../chfd-exercise/configs
popd