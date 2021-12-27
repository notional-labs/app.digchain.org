import axios from "axios";

const fetch_address = async (address) => {
    const options = {
      url: `https://api-1-dig.notional.ventures/auth/accounts/${address}}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
  
    await axios(options).then((response) => {
      console.log(response)
    })
  };
  
  
export  const fetchAccount = async (address) => {
    // get account
    try {
      let accountOnChain = await fetch_address(address);
      console.log("account on chain", accountOnChain)
  
      accountNumber =  accountOnChain.data.result.value.account_number,
      sequence = accountOnChain.data.result.value.sequence ? accountOnChain.data.result.value.sequence : 0
  
      return {
        accountNumber : accountOnChain.data.result.value.account_number,
        sequence : accountOnChain.data.result.value.sequence
      }
  
    } catch (err) {
      const accountOnChain = null
      return accountOnChain
    }
  }