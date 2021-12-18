import axios from 'axios'

export const getBalance = async (address) => {
    const URL = `http://65.21.202.37:2223/bank/balances/${address}`
    let balances = []
    const res= await axios.get(URL)
    if(res.data && res.data.result){
        balances.push([...res.data.result])   
    }
    return balances
}