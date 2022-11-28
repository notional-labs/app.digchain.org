import axios from "axios";
import { setupAuthExtension, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryAccountResponse } from "cosmjs-types/cosmos/auth/v1beta1/query";
import { BaseAccount } from "cosmjs-types/cosmos/auth/v1beta1/auth";

const rpc = process.env.REACT_APP_RPC
const vesting = '/cosmos.auth.v1beta1.BaseAccount'

const fetch_address = async (address) => {
  const tendermint = await Tendermint34Client.connect(rpc)
  const baseQuery = new QueryClient(tendermint)
  const extension = setupAuthExtension(baseQuery)
  const res = await extension.auth.account(address)
  let account = BaseAccount.decode(res.value)
  account.accountNumber = parseInt(account.accountNumber)
  account.sequence = parseInt(account.sequence)
  account.type = res.typeUrl
  return account
};


export const fetchAccount = async (address) => {
  // get account
  try {
    let accountOnChain = await fetch_address(address);

    if (accountOnChain.type.base_vesting_account != null) {
      const accountNumber = accountOnChain.accountNumber ? accountOnChain.accountNumber : 0
      const sequence = accountOnChain.sequence ? accountOnChain.sequence : 0
      return {
        accountNumber: accountNumber,
        sequence: sequence
      }

    } else {
      const accountNumber = accountOnChain.accountNumber ? accountOnChain.accountNumber : 0
      const sequence = accountOnChain.sequence ? accountOnChain.sequence : 0

      return {
        accountNumber: accountNumber,
        sequence: sequence
      }
    }
  } catch (err) {
    console.log(err)
    return err
  }
}