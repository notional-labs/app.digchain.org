import {
  coin
} from "@cosmjs/stargate";

export const transfer = async (client, address, amount, recipient) => {
  const fee = {
    amount: [coin(0, "udig")],
    gas: "200000",
  };

  const result = await client.sendTokens(
    address,
    recipient,
    [coin(amount, "udig")],
    fee,
  );

  console.log(result)
}

export const delegate = async (client, address, amount, recipient) => {
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