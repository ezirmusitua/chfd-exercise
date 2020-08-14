const {BankAccountContract} = require('./BankAccountContract');
const {StockAccountContract} = require('./StockAccountContract');
const {UserContract} = require('./UserContract');

module.exports.BankAccountContract = BankAccountContract;
module.exports.StockAccountContract = StockAccountContract;
module.exports.UserContract = UserContract;
module.exports.chaincodes = [BankAccountContract, StockAccountContract, UserContract];