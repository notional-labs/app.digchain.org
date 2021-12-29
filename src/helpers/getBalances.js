import axios from 'axios'
import { delegate } from './transaction'

const api = "http://0.0.0.0:1317"
// const api = "https://api-1-dig.notional.ventures"

export const getBalance = async (address) => {
    const URL = `${api}/bank/balances/${address}`
    let balances = []
    const res= await axios.get(URL)
    if(res.data.result && res.data.result.length > 0){
        balances.push([...res.data.result])   
    }
    return balances
}

export const getDelegation = async (address) => {
    const URL = `${api}/cosmos/staking/v1beta1/delegations/${address}`
    const res = await axios.get(URL)
    if (res.status !== 200) return 
    return res.data
}

export const getReward = async (address) => {
    const URL = `${api}/cosmos/distribution/v1beta1/delegators/${address}/rewards`
    const res = await axios.get(URL)
    if (res.status !== 200) return 
    return res.data
}

export const getUnbond = async (address) => {
    const URL = `${api}/cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`
    const res = await axios.get(URL)
    if (res.status !== 200) return 
    return res.data
}

export const getTotal = (balances) => {
    let sum = 0
    for (let i of balances){
        sum += parseInt(i.delegator_shares)
    }
    return sum
}

export const getAsset = async (address) => {
    let promises = []
    promises.push(getBalance(address))
    promises.push(getDelegation(address))
    promises.push(getReward(address))
    promises.push(getUnbond(address))

    const asset = await Promise.all(promises)
    return asset
}

export const getTotalDelegate = (delegations) => {
    let sum = 0
    for (let i of delegations){
        sum += parseInt(i.delegation.shares)
    }
    return sum
}

export const getTotalUnbonding = (unbondings) => {
    let sum = 0
    for (let i of unbondings){
        sum += parseInt(i.entries[0].balance)
    }
    return sum
}

