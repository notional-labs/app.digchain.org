import axios from 'axios'
import { setupGovExtension, QueryClient } from '@cosmjs/stargate'
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { ProposalStatus } from 'cosmjs-types/cosmos/gov/v1beta1/gov';

const api = process.env.REACT_APP_API
const rpc = process.env.REACT_APP_RPC

export const getProposals = async (params) => {
    const tendermint = await Tendermint34Client.connect(rpc)
    const baseQuery = new QueryClient(tendermint)
    const extension = setupGovExtension(baseQuery)
    const res = await extension.gov.proposals(ProposalStatus.UNRECOGNIZED)
    console.log(res)
    return res
}

export const getTally = async (id) => {
    const URL = `${api}gov/proposals/${id}/tally`
    const res = await axios.get(URL)
    if(res.status !== 200) return 
    return res.data
}

export const getBond = async () => {
    const URL = `${api}staking/pool`
    const res = await axios.get(URL)
    if(res.status !== 200) return 
    return res.data
}

export const getProposal = async (id) => {
    const URL = `${api}gov/proposals/${id}`
    const res = await axios.get(URL)
    if(res.status !== 200) return
    return res.data
}

export const getProposer = async (id) => {
    const URL = `${api}gov/proposals/${id}/proposer`
    const res = await axios.get(URL)
    if (res.status !== 200) return
    return res.data
}

export const getVotes = async (id) => {
    const URL = `${api}cosmos/gov/v1beta1/proposals/${id}/votes?pagination.key=&pagination.limit=500`
    const res = await axios.get(URL)
    if (res.status !== 200) return
    return res.data
}

export const getParams = async () => {
    const URL = `${api}cosmos/gov/v1beta1/params/deposit`
    const res = await axios.get(URL)
    if (res.status !== 200) return
    return res.data.deposit_params.min_deposit
}
