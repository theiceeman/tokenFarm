const { assert } = require('chai');

const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

require('chai')
    .use(require('chai-as-promised'))
    .should();

function tokens(n) {
    return web3.utils.toWei(n, 'Ether');
}

contract('TokenFarm', ([owner, investor]) => {

    let daiToken, dappToken, tokenFarm;

    before(async () => {
        // load contracts
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

        // transfer all dapp tokens to farm
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))

        // transfer token to investor address
        await daiToken.transfer(investor, tokens('100'), { from: owner });
    })


    describe('Mock Dai Deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name();
            assert.equal(name, 'Mock DAI Token');
        });
    })
    describe('Dapp token Deployment', async () => {
        it('has a name', async () => {
            const name = await dappToken.name();
            assert.equal(name, 'DApp Token');
        });
    })
    describe('Token Farm Deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name();
            assert.equal(name, 'Token Farm');
        });

        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), tokens('1000000'), 'Insufficient funds!')
        })
    })

    describe('Farming Tokens', async () => {
        it('reward investors for staking mDai tokens', async () => {
            let result;

            // check investor balance before staking
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'Investor Dai wallet balance is insufficient')

            // stake mock dai tokens
            // when transferring from a wallet, solidity requires approval
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });
            await tokenFarm.stakeTokens(tokens('100'), { from: investor });


            // check investor balance after staking
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('0'), 'Investor Dai wallet balance is correct after staking')

            // check tokenFarm balance after staking
            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('100'), 'Token farm Dai wallet balance is correct after staking')

            // check tokenFarm balance after staking
            result = await tokenFarm.userStakingBalance(investor);
            assert.equal(result.toString(), tokens('100'), 'Investor Token staking wallet balance is correct after staking')

            // issue tokens
            await tokenFarm.issueToken({from: owner});

            // check investor balance after earning token
            result = await dappToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'investor wallet balance didnt earn token')

            // ensure only owner can issue token
            await tokenFarm.issueToken({from: investor}).should.be.rejected;

            // unstake tokens
            await tokenFarm.unStakeTokens({from:investor});

            // check results after unstaking
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'),'Investors Dai wallet balance is correct after unstaking');

            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('0'),'Token farm Dai balance is correct after unstaking');

            result = await tokenFarm.userStakingBalance(investor);
            assert.equal(result.toString(), tokens('0'),'Investors Dapp wallet balance is correct after unstaking');

            result = await tokenFarm.userStakingStatus(investor);
            assert.equal(result.toString(), 'false', 'Investors staking status is correct ');

        })
    })
})