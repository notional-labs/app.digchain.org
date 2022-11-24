import axios from "axios";
import { setupTxExtension, QueryClient } from '@cosmjs/stargate'
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

const rpc = process.env.REACT_APP_RPC

export const getTxs = async (address, params) => {
    const tendermint = await Tendermint34Client.connect(rpc)
    const baseQuery = new QueryClient(tendermint)
    const extension = setupTxExtension(baseQuery)
    const res = await extension.tx.getTxs()
    return res
}