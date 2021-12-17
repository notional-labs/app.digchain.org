import { SigningCosmosClient, LcdClient, setupBankExtension } from "@cosmjs/launchpad";
import { digChain, ethChain } from '../chainObj';

export const getKeplr = async (chain_id = "dig-1") => {
    if (!window.getOfflineSigner || !window.keplr) {
        alert("Keplr Wallet not detected, please install extension");
        return undefined
    } else {
        if (chain_id === 'dig-1'){
            await window.keplr.experimentalSuggestChain(digChain)
        }
        else {
            await window.keplr.experimentalSuggestChain(ethChain)
        }
        await window.keplr.enable('dig-1')
        const offlineSigner = window.keplr.getOfflineSigner('dig-1');
        const accounts = await offlineSigner.getAccounts();
        console.log(accounts)
        return {
            accounts,
            offlineSigner,
        };
    }
}

export const getCosmosClient = (accounts, offlineSigner) => {
    const URL = "http://65.21.202.37:8001"
    const cosmJS = new SigningCosmosClient(
      URL,
      accounts[0].address,
      offlineSigner,
    );
    return cosmJS;
  }

