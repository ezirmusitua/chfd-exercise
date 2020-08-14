const {isUserOperatorOrg} = require("./utils");
const {Contract, ClientIdentity} = require('fabric-contract-api');

const STOCK_ACCOUNT_COLLECTION = 'collectionStockAccount';

class StockAccountContract extends Contract {
  async getStockAccount({stub}, type, id) {
    const key = stub.createCompositeKey('statetype~type~id', ['stockAccount', type, id]);
    return await stub.getPrivateData(STOCK_ACCOUNT_COLLECTION, key);
  }

  async addStockAccount({stub}, type, id, name) {
    const identity = new ClientIdentity(stub);
    isUserOperatorOrg(identity);
    if (!identity.assertAttributeValue('hf.role', 'admin')) {
      throw new Error("Not Bank Account Admin");
    }
    const key = stub.createCompositeKey('statetype~type~id', ['stockAccount', type, id]);
    await stub.putPrivateData(
      STOCK_ACCOUNT_COLLECTION,
      key,
      Buffer.from(JSON.stringify({stateType: 'stockAccount', type, id, name}))
    );
    return Buffer.from("Add Bank Account Done");
  }
}

module.exports.StockAccountContract = StockAccountContract;
