const USER_OPERATOR_ORG_MSP = 'Org1MSP';

function isUserOperatorOrg(identity) {
  if (identity.getMSPID() !== USER_OPERATOR_ORG_MSP) throw new Error("Organization Can Not Add User");
}

async function loopIterator(iterator) {
  const allResults = [];
  while (true) {
    const res = await iterator.next();
    if (res.value) {
      allResults.push(res.value.value.toString('utf8'));
    }

    if (res.done) {
      await iterator.close();
      return allResults;
    }
  }
}

module.exports = {isUserOperatorOrg, loopIterator};