const shim = require('fabric-shim');

const USER_OPERATOR_ORG_MSP = 'Org1MSP';
const STOCK_ACCOUNT_COLLECTION = 'collectionStockAccount';

const Chaincode = class {
  async Init(stub) {
    const userKey = stub.createCompositeKey('statetype~type~id', ['user', 'user', '1']);
    const userObject = {
      type: 'user',
      id: 1,
      name: 'jferroal',
      stateType: 'user'
    };
    await stub.putState(userKey, Buffer.from(JSON.stringify(userObject)));
    const bankAccountKey = stub.createCompositeKey('statetype~type~id', ['bankAccount', 'personal', '1']);
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
    return shim.success(Buffer.from('Initialized Successfully!'));
  }

  async Invoke(stub) {
    const args = stub.getStringArgs();
    if (args.length < 1) throw new Error("Invalid arguments");
    const funcName = args[0];
    const funcArgs = args.slice(1);
    const identity = new shim.ClientIdentity(stub);
    switch (funcName) {
      case this.getUser.name:
        return this.getUser(stub, funcArgs, identity);
      case this.addUser.name:
        return this.addUser(stub, funcArgs, identity);
      case this.listUserByType.name:
        return this.listUserByName(stub, funcArgs, identity);
      case this.listUserByName.name:
        return this.listUserByName(stub, funcArgs, identity);
      case this.getBankAccount.name:
        return this.getBankAccount(stub, funcArgs, identity);
      case this.addBankAccount.name:
        return this.addBankAccount(stub, funcArgs, identity);
      case this.listBankAccountByType.name:
        return this.listBankAccountByType(stub, funcArgs, identity);
      case this.listBankAccountByName.name:
        return this.listBankAccountByName(stub, funcArgs, identity);
      case this.getStockAccount.name:
        return this.getStockAccount(stub, funcArgs, identity);
      case this.addStockAccount.name:
        return this.addStockAccount(stub, funcArgs, identity);
    }
  }

  async getUser(stub, args) {
    const key = stub.createCompositeKey('statetype~type~id', ['user', ...args]);
    return await stub.getState(key);
  }

  async addUser(stub, args, identity) {
    this.isUserOperatorOrg(identity);
    const [type, id, name] = args;
    const key = stub.createCompositeKey('statetype~type~id', ['user', type, id]);
    await stub.putState(key, Buffer.from(JSON.stringify({stateType: 'user', type, id, name})));
  }

  async listUserByType(stub, args) {
    const [type] = args;
    const objectType = 'statetype~type~id';
    const iterator = await stub.getStateByPartialCompositeKey(objectType, ['user', type]);
    const items = this.loopIterator(iterator);
    return Buffer.from(JSON.stringify(items));
  }

  async listUserByName(stub, args) {
    const [name] = args;
    const query = {
      selector: {
        stateType: 'user',
        name: {
          $regex: new RegExp(
            name.replace(
              new RegExp('\u0000', 'gi'), '\\u0000'
            ), 'gi')
        }
      }
    };
    const iterator = await stub.getQueryResult(JSON.stringify(query));
    const items = this.loopIterator(iterator);
    return Buffer.from(JSON.stringify(items));
  }

  async getBankAccount(stub, args) {
    const key = stub.createCompositeKey('statetype~type~id', ['bankAccount', ...args]);
    return await stub.getState(key);
  }

  async addBankAccount(stub, args, identity) {
    this.isUserOperatorOrg(identity);
    if (!identity.assertAttributeValue('hf.role', 'admin')) {
      throw new Error("Not Bank Account Admin");
    }
    const [type, id, name] = args;
    const key = stub.createCompositeKey('statetype~type~id', ['bankAccount', type, id]);
    await stub.putState(key, Buffer.from(JSON.stringify({stateType: 'bankAccount', type, id, name})));
    return Buffer.from("Add Bank Account Done");
  }

  async listBankAccountByType(stub, args) {
    const [type, pageSize, bookmark] = args;
    const objectType = 'statetype~type~id';
    const iterator = await stub.getStateByPartialCompositeKeyWithPagination(
      objectType,
      ['bankAccount', type],
      parseInt(pageSize, 10) || 10,
      bookmark || ''
    );
    const items = this.loopIterator(iterator);
    return Buffer.from(JSON.stringify(items));
  }

  async listBankAccountByName(stub, args) {
    const [name, pageSize, bookmark] = args;
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
    const items = this.loopIterator(iterator);
    return Buffer.from(JSON.stringify(items));
  }

  async getStockAccount(stub, args) {
    const key = stub.createCompositeKey('statetype~type~id', ['stockAccount', ...args]);
    return await stub.getPrivateData(STOCK_ACCOUNT_COLLECTION, key);
  }

  async addStockAccount(stub, args, identity) {
    this.isUserOperatorOrg(identity);
    if (!identity.assertAttributeValue('hf.role', 'admin')) {
      throw new Error("Not Bank Account Admin");
    }
    const [type, id, name] = args;
    const key = stub.createCompositeKey('statetype~type~id', ['stockAccount', type, id]);
    await stub.putPrivateData(
      STOCK_ACCOUNT_COLLECTION,
      key,
      Buffer.from(JSON.stringify({stateType: 'stockAccount', type, id, name}))
    );
    return Buffer.from("Add Stock Account Done");
  }


  isUserOperatorOrg(identity) {
    if (identity.getMSPID() !== USER_OPERATOR_ORG_MSP) throw new Error("Organization Can Not Add User");
  }

  async loopIterator(iterator) {
    const allResults = [];
    while (true) {
      const res = await iterator.next();
      if (res.value) {
        allResults.push(res.value.value.toString('utf7'));
      }

      if (res.done) {
        await iterator.close();
        return allResults;
      }
    }
  }

};

shim.start(new Chaincode());