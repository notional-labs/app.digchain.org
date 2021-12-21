import { coins,} from "@cosmjs/launchpad";
import {
  coin
} from "@cosmjs/stargate";
import { MsgDelegate } from "@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx";

export const transaction = async (cosmJS, amount = 1000000, recipient = 'osmo1vxgcyq7nc8d8gykhwf35e4z0l04xhn4fq456uj') => {
  // define memo (not required)
  const memo = "Deposit";
  // sign and broadcast Tx
  const ret = await cosmJS.sendTokens(recipient, coins(amount, "uosmo"), memo);
  console.log(ret.transactionHash)
  return ret
}

export const delegate = async (client, address, amount, recipient) => {
  console.log(MsgDelegate)
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
    gas: "80000",
  };

  const result = await client.delegateTokens(
    address,
    recipient,
    coin(amount, "udig"),
    fee,
  );

  console.log(result)
}