import { coins,} from "@cosmjs/launchpad";
import {
  coin
} from "@cosmjs/stargate";

export const transaction = async (cosmJS, amount = 1000000, recipient) => {
  // define memo (not required)
  const memo = "Deposit";
  // sign and broadcast Tx
  const ret = await cosmJS.sendTokens(recipient, coins(amount, "uosmo"), memo);
  console.log(ret.transactionHash)
  return ret
}

export const delegate = async (client, address, amount, recipient) => {
  // const msg = MsgDelegate.encode({
  //   delegatorAddress: address,
  //   validatorAddress: recipient,
  //   amount: coin(amount, "udig"),
  // });
  // const msgAny = {
  //   typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
  //   value: msg,
  // };
  const fee = {
    amount: [coin(0, "udig")],
    gas: "200000",
  };

  const result = await client.delegateTokens(
    address,
    recipient,
    coin(amount, "udig"),
    fee,
  );

  console.log(result)
}

export const withDrawal = async (client, address, amount, validatorAddress) => {
  const fee = {
    amount: [coin(0, "udig")],
    gas: "200000",
  };
  
  const result = await client.withdrawRewards(
    address,
    validatorAddress,
    coin(amount, "udig"),
    fee,
  );

  console.log(result)
}