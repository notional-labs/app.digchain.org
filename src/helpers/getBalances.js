import axios from 'axios'

export const getBalance = async (address) => {
    const URL = `https://api-1-dig.notional.ventures/bank/balances/${address}`
    let balances = []
    const res= await axios.get(URL)
    if(res.data.result && res.data.result.length > 0){
        balances.push([...res.data.result])   
    }
    return balances
}

export const getDelegation = async (address) => {
    const URL = `https://api-1-dig.notional.ventures/cosmos/staking/v1beta1/delegations/${address}`
    const res = await axios.get(URL)
    return res
}

export const getReward = async (address) => {
    const URL = `https://api-1-dig.notional.ventures/cosmos/distribution/v1beta1/delegators/${address}/rewards`
    const res = await axios.get(URL)
    return res
}

export const getUnbond = async (address) => {
    const URL = `https://api-1-dig.notional.ventures/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`
    const res = await axios.get(URL)
    return res
}

export const getTotal = (balances) => {
    let sum = 0
    for (let i of balances){
        sum += parseInt(i.delegator_shares)
    }
    return sum
}

