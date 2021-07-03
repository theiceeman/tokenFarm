
const TokenFarm = artifacts.require("TokenFarm");

module.exports = (async cb=> {
    let tokenFarm = await TokenFarm.deployed()
    await tokenFarm.issueToken()
    console.log('Tokens Issued!');
    cb();
})