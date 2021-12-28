import axios from "axios";

const fetch_address = async (address) => {
    const options = {
      url: `https://api-1-dig.notional.ventures/auth/accounts/${address}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
  
    return axios(options)
  };
  
  
export const fetchAccount = async (address) => {
  console.log("fuck")
    // get account
    try {
      let accountOnChain = await axios.get(`http://127.0.0.1:1317/auth/accounts/${address}`);
      console.log("account on chain", accountOnChain)
  
      const accountNumber = accountOnChain.data.result.value.account_number ? accountOnChain.data.result.value.account_number : 0
      const sequence = accountOnChain.data.result.value.sequence ? accountOnChain.data.result.value.sequence : 0
      console.log(accountNumber)
      console.log(sequence)

      return {
        accountNumber : accountOnChain.data.result.value.account_number,
        sequence : accountOnChain.data.result.value.sequence
      }
  
    } catch (err) {
      const accountOnChain = null
      return accountOnChain
    }
  }