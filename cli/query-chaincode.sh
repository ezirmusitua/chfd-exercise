peer chaincode query \
-C mychannel \
-n cc0 \
-c '{"Func":"getUser","Args":[]}' \
--peerAddress localhost:7051 \
-o localhost:7050 \
--cafile $PWD/configs/crypto-configs/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem