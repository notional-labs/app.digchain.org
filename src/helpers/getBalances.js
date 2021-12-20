import axios from 'axios'

export const getBalance = async (address) => {
    const URL = `https://digapi.chillvalidation.com/bank/balances/${address}`
    let balances = []
    const res= await axios.get(URL)
    if(res.data && res.data.result.lenght > 0){
        balances.push([...res.data.result])   
    }
    return balances
}

export const getTotal = (balances) => {
    let sum = 0
    for (let i of balances){
        sum += parseInt(i.delegator_shares)
    }
    return sum
}

