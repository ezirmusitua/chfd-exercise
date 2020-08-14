pushd ..

peer chaincode install \
-n cc0 \
-v 0.1.0 \
-l node \
-p $PWD/chaincodes/cc0

peer chaincode install \
-n cc1 \
-v 0.1.0 \
-l node \
-p $PWD/chaincodes/cc0

popd
