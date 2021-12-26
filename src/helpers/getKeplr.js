import { SigningCosmosClient, LcdClient, setupBankExtension } from "@cosmjs/launchpad";
import { digChain, ethChain } from '../chainObj';
import {
    SigningStargateClient,
    StargateClient,
} from "@cosmjs/stargate";
// import { MsgDelegate } from "@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx";

export const getKeplr = async (chain_id = "dig-1") => {
    if (!window.getOfflineSigner || !window.keplr) {
        alert("Keplr Wallet not detected, please install extension");
        return undefined
    } else {
        if (chain_id === 'dig-1') {
            await window.keplr.experimentalSuggestChain(digChain)
        }
        await window.keplr.enable('dig-1')
        const offlineSigner = window.keplr.getOfflineSigner('dig-1');
        const accounts = await offlineSigner.getAccounts();
        accounts.chain = chain_id
        return {
            accounts,
            offlineSigner,
        };
    }
}

export const getCosmosClient = (address, offlineSigner) => {
    const URL = "https://api-1-dig.notional.ventures"
    const cosmJS = new SigningCosmosClient(
        URL,
        address,
        offlineSigner,
    );
    return cosmJS;
}

export const getStargateClient = async (signer) => {
    const rpcEndpoint = "https://rpc-1-dig.notional.ventures";
    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer);
    return client
} 
