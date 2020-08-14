peer chaincode query \
-C mychannel \
-n cc0 \
-c '{"Func":"addUser","Args":["user","2","ezirmusitua"]}' \
--tls \
--peerAddress localhost:7051 \
-o localhost:7050 \
--cafile $PWD/configs/crypto-configs/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
--tlsRootCertFiles $PWD/configs/crypto-configs/peerOrganizations/org1.example.com/msp/tlscacerts/tlsca.org1.example.com-cert.pem \
--waitForEvent 60s

