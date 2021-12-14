import React, { Component } from 'react'
import daiLogo from '../dai.png';

class Main extends Component {

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            daiToken: {},
            dappToken: {},
            tokenFarm: {},
            daiTokenBalance: '0',
            dappTokenBalance: '0',
            userStakingBalance: '0',
            loading: true,
        }
    }

    

    render() {
        return (
            <div id="content" className="mt-3">
                <table className="table table-borderless text-muted text-center">
                    <thead>
                        <tr>
                            <th scope="col">Staking Balance</th>
                            <th scope="col">Reward Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDai
                            </td>
                            <td>
                                {window.web3.utils.fromWei(this.props.dappTokenBalance, 'Ether')} Dapp
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="card mb-4">
                    <div className="card-body">
                        <form className="mb-3" onSubmit={(e) => {
                            e.preventDefault();
                            let amt;
                            amt = this.input.value.toString();
                            amt = window.web3.utils.toWei(amt, 'Ether');
                            this.props.stakeTokens(amt);
                        }}>
                            <div>
                                <label className="float-left"> <b>Stake Tokens</b> </label>
                                <span className="float-right text-muted">
                                    Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, 'Ether')}</span>
                            </div>
                            <div className="input-group mb-4">
                                <input type="text" ref={(input) => { this.input = input }} className="form-control form-control-lg" placeholder="0" required />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <img src={daiLogo} height="32" alt="" />
                                        &nbsp;&nbsp;&nbsp; mDai
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
                        </form>
                        <button type="submit" className="btn btn-link btn-block btn-sm" onClick={(e)=>{
                            e.preventDefault();
                            this.props.unstakeTokens()
                        }}> Un-Stake... </button>
                    </div>
                </div>


            </div>
        );
    }
}

export default Main;
