const {isUserOperatorOrg, loopIterator} = require("./utils");
const {Contract, ClientIdentity} = require('fabric-contract-api');

class UserContract extends Contract {
  constructor() {
    super('UserContract');
  }

  async getUser({stub}, type, id) {
    const key = stub.createCompositeKey('statetype~type~id', ['user', type, id]);
    return await stub.getState(key);
  }

  async addUser({stub}, type, id, name) {
    const identity = new ClientIdentity(stub);
    isUserOperatorOrg(identity);
    const key = stub.createCompositeKey('statetype~type~id', ['user', type, parseInt(id, 10)]);
    await stub.putState(key, Buffer.from(JSON.stringify({stateType: 'user', type, id: parseInt(id, 10), name})));
  }

  async listUserByType({stub}, type) {
    const objectType = 'statetype~type~id';
    const iterator = await stub.getStateByPartialCompositeKey(objectType, ['user', type]);
    const items = loopIterator(iterator);
    return Buffer.from(JSON.stringify(items));
  }

  async listUserByName({stub}, name) {
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
    const items = loopIterator(iterator);
    return Buffer.from(JSON.stringify(items));
  }
}

module.exports.UserContract = UserContract;
