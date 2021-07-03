const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
  // deploy the DaiToken
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  // deploy the DaiToken
  await deployer.deploy(DappToken);
  const dappToken = await DappToken.deployed();

  // deploy the tokenFarm contract
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // transfer the dappTokens to the tokenFarm
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');

  // transfer 100 daiToken to investor account
  await daiToken.transfer(accounts[1], '100000000000000000000');
};
