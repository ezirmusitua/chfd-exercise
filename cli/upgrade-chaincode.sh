
peer chaincode upgrade \
-C mychannel \
-c '{"Func":"init","Args":[]}' \
-l node \
-n cc0 \
-v 0.1.0 \
--collections-config $PWD/chaincodes/cc0/stock-account.json
-P 'OR("Org1.admin","Org2.admin")' \
-o orderer:8050 \
--tls \
--cafile $PWD/configs/crypto-config/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem


peer chaincode upgrade \
-C mychannel \
-c '{"Func":"init","Args":[]}' \
-l node \
-n cc1 \
-v 0.1.0 \
--collections-config $PWD/chaincodes/cc1/stock-account.json
-P 'OR("Org1.admin","Org2.admin")' \
-o orderer:8050 \
--tls \
--cafile $PWD/configs/crypto-config/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem
