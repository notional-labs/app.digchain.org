import axios from 'axios'

export const getBalance = async (address) => {
    const URL = `http://65.21.202.37:2223/bank/balances/${address}`
    let balances = []
    const res= await axios.get(URL)
    if(res.data.result && res.data.result.length > 0){
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

