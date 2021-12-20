import { coins, coin} from "@cosmjs/launchpad";

export const transaction = async (cosmJS, amount = 1000000, recipient = 'osmo1vxgcyq7nc8d8gykhwf35e4z0l04xhn4fq456uj') => {
    // define memo (not required)
    const memo = "Deposit";
    // sign and broadcast Tx
    const ret = await cosmJS.sendTokens(recipient, coins(amount, "uosmo"), memo);
    console.log(ret.transactionHash)
    return ret
  }

export const delegate = async (cosmJS, amount, recipient) => {
  console.log(cosmJS)
  console.log(amount)
  console.log(recipient)
  const msg = {
    type: "cosmos-sdk/MsgDelegate",
    value: {
      delegator_address: cosmJS,
      validator_address: recipient,
      amount: coin(amount, "udig"),
    },
  }
  const fee = {
    amount: coins(0, "udig"),
    gas: "80000", 
  };
  const ret = await cosmJS.signAndBroadcast([msg], fee);
  console.log(ret)
}