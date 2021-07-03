pragma solidity ^0.5.0;

/*
WHAT WE'RE BUILDING
Investor will deposit[stake] DAI into the farm to buy the Dapps tokens.
So interest they earn will be in the Dapps token.
Investor can withdraw their token in Dai.

 */

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
    string public name = "Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public allStakers; // all users that have staked
    mapping(address => uint256) public userStakingBalance; // current user staking balance
    mapping(address => bool) public hasStaked; // current user staking status
    mapping(address => bool) public userStakingStatus; //

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function stakeTokens(uint256 _amount) public {
        // check that user staking amount is valid
        require(_amount > 0, "Invalid staking balance");

        // transfer Dai token from user wallet to farm address.
        // `this` refers to the contract
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // update the users staking balance
        userStakingBalance[msg.sender] += _amount;

        // add user to stakedUser array
        if (!hasStaked[msg.sender]) allStakers.push(msg.sender);

        // update user staking status
        userStakingStatus[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function issueToken() public {
        // only contract deployer can issue tokens
        require(msg.sender == owner, "only contract deployer can issue tokens");

        for (uint256 i = 0; i < allStakers.length; i++) {
            address recipent = allStakers[i];
            uint256 recipentBalance = userStakingBalance[recipent];
            if (recipentBalance > 0) {
                dappToken.transfer(recipent, recipentBalance);
            }
        }
    }

    function unStakeTokens() public {
        // fetch staking balance
        uint256 balance = userStakingBalance[msg.sender];

        require(balance > 0, "Amount cant equal zero");

        daiToken.transfer(msg.sender, balance);

        userStakingBalance[msg.sender] = 0;

        userStakingStatus[msg.sender] = false;
    }
}
