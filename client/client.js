const fs = require('fs');
const FabricCAServices = require("fabric-ca-client");
const {
  Gateway,
  FileSystemWallet,
  X509WalletMixin,
  EventStrategies,
} = require('fabric-network');
const {User} = require('fabric-client');

const mspid = 'Org1MSP';
const channelId = 'mychannel';
const timeout = 300;
const username = 'org1submiter@org1.example.com';
const wallet = new FileSystemWallet('../identity/user/isabella/wallet');
const ccp = JSON.parse(fs.readFileSync('../configs/connection-org1.json').toString());
const cco = {
  identity: username + Date.now(),
  wallet: wallet,
  eventHandlerOptions: {
    commitTimeout: timeout,
    strategy: EventStrategies.MSPID_SCOPE_ANYFORTX
  }
};
const cainfo = ccp.certificateAutorities['ca.org1.example.com'];
const fabricCA = new FabricCAServices(cainfo.url, {trustedRoots: cainfo.tlsCACerts.pem}, cainfo.caName);

async function main() {
  const adminEnrollment = caService.enroll({
    enrollmentID: 'admin',
    enrollmentSecret: 'adminpw'
  });
  const registar = new User('admin');
  await registar.setEnrollment(adminEnrollment.key, adminEnrollment.certificate, mspid);
  await fabricCA.register({
    enrollmentID: username,
    enrollmentSecret: 'no-secret',
    role: 'admin',
    affiliation: 'org1.department1',
    maxEnrollments: 100,
    attrs: {'hf.role': 'admin'}
  }, registar);
  const enrollment = await fabricCA.enroll({
    enrollmentID: username,
    enrollmentSecret: 'no-secret'
  });
  await wallet.import(
    username,
    X509WalletMixin.createIdentity(
      mspid,
      enrollment.certificate,
      enrollment.key.toString()
    )
  );


  const gateway = new Gateway();
  await gateway.connect(ccp, cco);
  const network = await gateway.getNetwork(channelId);
  const channel = network.getChannel();
  const org1Peer0EventHub = channel.getChannelEventHub('peer0.org1.example.com');
  const cc0 = network.getContract('cc0');
  const cc1 = {
    user: network.getContract('cc1', 'UserContract'),
    bankAccount: network.getContract('cc1', 'BankAccountContract'),
    stockAccount: network.getContract('cc1', 'StockAccountContract'),
  };
  org1Peer0EventHub.registerBlockEvent((block) => {
    console.info("new block write to ledger: ", block);
  }, (err) => {
    console.error("block event error: ", err);
    org1Peer0EventHub.disconnect();
  }, {disconnect: true, unregister: true});
  let result = await cc0.evaluateTransaction("getUser", "user", "1");
  console.info("getUser in cc0: ", result);
  let txn = await cc0.createTransaction("getBankAccount");
  result = await txn.evaluate("bankAccount", "1");
  console.info("getBankAccount in cc0: ", result);
  result = await cc0.evaluateTransaction('listUserByType', 'user');
  console.info("listUserByType in cc0: ", result);
  result = await cc0.evaluateTransaction('listUserByName', 'jfe');
  console.info("listUserByName in cc0: ", result);
  result = await cc0.evaluateTransaction('listBankAccountByName', 'jfe');
  console.info("listBankAccountByName in cc0: ", result);
  result = await cc0.evaluateTransaction('getStockAccount', 'personal', "1");
  console.info("getStockAccount in cc0: ", result);
  result = await cc0.submitTransaction("addUser", "user", Date.now().toString(), "tester" + Date.now());
  console.info("addUser in cc0: ", result);
  txn = await cc0.createTransaction("addBankAccount");
  result = await txn.submit("bankAccount", Date.now().toString());
  console.info("addBankAccount in cc0: ", result);
  result = await cc0.evaluateTransaction('addStockAccount', 'personal', "1", "tester" + Date.now());
  console.info("addStockAccount in cc0: ", result);

  result = await cc1.user.evaluateTransaction("getUser", "user", "1");
  console.info("getUser in cc0: ", result);
  txn = await cc1.bankAccount.createTransaction("getBankAccount");
  result = await txn.evaluate("bankAccount", "1");
  console.info("getBankAccount in cc0: ", result);
  result = await cc1.user.evaluateTransaction('listUserByType', 'user');
  console.info("listUserByType in cc0: ", result);
  result = await cc1.user.evaluateTransaction('listUserByName', 'jfe');
  console.info("listUserByName in cc0: ", result);
  result = await cc1.bankAccount.evaluateTransaction('listBankAccountByName', 'jfe');
  console.info("listBankAccountByName in cc0: ", result);
  result = await cc1.stockAccount.evaluateTransaction('getStockAccount', 'personal', "1");
  console.info("getStockAccount in cc0: ", result);
  result = await cc1.user.submitTransaction("addUser", "user", Date.now().toString(), "tester" + Date.now());
  console.info("addUser in cc0: ", result);
  txn = await cc1.bankAccount.createTransaction("addBankAccount");
  result = await txn.submit("bankAccount", Date.now().toString());
  console.info("addBankAccount in cc0: ", result);
  result = await cc1.stockAccount.evaluateTransaction('addStockAccount', 'personal', "1", "tester" + Date.now());
  console.info("addStockAccount in cc0: ", result);

  const firstBlock = await channel.queryBlock(0);
  console.info("firstBlock: ", firstBlock);
}

