const {isUserOperatorOrg, loopIterator} = require("./utils");
const {Contract, ClientIdentity} = require('fabric-contract-api');

class BankAccountContract extends Contract {
  constructor() {
    super('BankAccountContract');
  }

  async init({stub}) {
    const userKey = stub.createCompositeKey('statetype~type~id', ['user', 'user', '123']);
    const userObject = {
      type: 'user',
      id: 1,
      name: 'jferroal',
      stateType: 'user'
    };
    await stub.putState(userKey, Buffer.from(JSON.stringify(userObject)));
    const bankAccountKey = stub.createCompositeKey('statetype~type~id', ['bankAccount', 'personal', '123']);
    const bankAccountObject = {
      type: 'personal',
      id: 1,
      name: 'jferroal',
      stateType: 'bankAccount'
    };
    await stub.putState(bankAccountKey, Buffer.from(JSON.stringify(bankAccountObject)));
    const stockAccountKey = stub.createCompositeKey('statetype~type~id', ['stockAccount', 'personal', '1']);
    const stockAccountObject = {
      type: 'personal',
      id: 1,
      name: 'jferroal',
      stateType: 'bankAccount'
    };
    await stub.putState(stockAccountKey, Buffer.from(JSON.stringify(stockAccountObject)));
    return Buffer.from('Initialized Successfully!');
  }

  async getBankAccount({stub}, type, id) {
    const key = stub.createCompositeKey('statetype~type~id', ['bankAccount', type, id]);
    return await stub.getState(key);
  }

  async addBankAccount({stub}, type, id, name) {
    const identity = new ClientIdentity(stub);
    isUserOperatorOrg(identity);
    if (!identity.assertAttributeValue('hf.role', 'admin')) {
      throw new Error("Not Bank Account Admin");
    }
    const key = stub.createCompositeKey('statetype~type~id', ['bankAccount', type, id]);
    await stub.putState(key, Buffer.from(JSON.stringify({stateType: 'bankAccount', type, id, name})));
    return Buffer.from("Add Bank Account Done");
  }

  async listBankAccountByType({stub}, type, pageSize, bookmark) {
    const objectType = 'statetype~type~id';
    const iterator = await stub.getStateByPartialCompositeKeyWithPagination(
      objectType,
      ['bankAccount', type],
      parseInt(pageSize, 10) || 10,
      bookmark || ''
    );
    const items = loopIterator(iterator);
    return Buffer.from(JSON.stringify(items));
  }

  async listBankAccountByName({stub}, name, pageSize, bookmark) {
    const query = {
      selector: {
        stateType: 'bankAccount',
        name: {
          $regex: new RegExp(
            name.replace(
              new RegExp('\u0000', 'gi'), '\\u0000'
            ), 'gi')
        }
      }
    };
    const iterator = await stub.getQueryResultWithPagination(
      JSON.stringify(query),
      parseInt(pageSize, 10) || 10,
      bookmark || ''
    );
    const items = loopIterator(iterator);
    return Buffer.from(JSON.stringify(items));
  }
}

module.exports.BankAccountContract = BankAccountContract;