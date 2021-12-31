import { makeSignDocJsonString } from "../eth-transaction/Sign"
import { makeAuthInfoBytes, makeEthPubkeyFromByte} from "../eth-transaction/Auth";
import { getUint8ArrayPubKey } from "../metamaskHelpers";
import { makeRawTxBytes, makeTxBodyBytes} from "../eth-transaction/Tx"
import { fetchAccount} from './fetch'
import { Registry, encodePubkey} from "@cosmjs/proto-signing"
import { recoverPersonalSignature} from '@metamask/eth-sig-util'
import { toBase64 } from "@cosmjs/encoding"
import { defaultRegistryTypes, StargateClient } from "@cosmjs/stargate";


function fromHexString (hexString){
  if (hexString.slice(0,2) == "0x") {
    return Uint8Array.from(Buffer.from(hexString.slice(2), 'hex'));
  }
  return Uint8Array.from(Buffer.from(hexString, 'hex'));
}

export const broadcastTransaction = async (address, msg, signDocMsg, chainId, memo, gasLimit, web3) => {
    
    try {
      let stdFeeToPutIntoSignDoc = {
        amount: [],
        gas: gasLimit.toString(),
      };

    let fee = {
        amount : [],
        gasLimit: gasLimit.toString(),
    }
    console.log(address)
    const accountOnChain = await fetchAccount(address)
    
    if (accountOnChain == null){
      return err
    }
    const signDocJsonString = makeSignDocJsonString(signDocMsg, stdFeeToPutIntoSignDoc, chainId, memo, accountOnChain.accountNumber, accountOnChain.sequence) 
    console.log(signDocJsonString)
    const params = [address, signDocJsonString];
    const method = 'personal_sign';

    var pubKeyBytes = null;
    var signature_metamask = null;
    var ans = null
      web3.currentProvider.send(
        {
          method,
          params,
          address,
        },
        function(err, result){
            if (result.error) {
              alert(result.error.message);
            }
            if (result.error) return console.error('ERROR', result);
  
            // get pubKey bytes
            pubKeyBytes = getUint8ArrayPubKey({
              data: signDocJsonString,
              signature: result.result
            })
            signature_metamask = result.result
          }
        ).then(() => {
          const ethPubKey = makeEthPubkeyFromByte(pubKeyBytes)
          const bodyBytes = makeTxBodyBytes(msg, memo)
          console.log("ethPubByte", ethPubKey)
  
          const authInfoBytes = makeAuthInfoBytes(fee, ethPubKey, 191, accountOnChain.sequence)
          const signature = fromHexString(signature_metamask)
          signature[64] = 0 
          console.log("signature", signature )
          const txRawBytes = makeRawTxBytes(authInfoBytes, bodyBytes, [signature])
          //TODO : pls change node = env var
          const node = "127.0.0.1:26657"
          StargateClient.connect(node).then(
            (broadcaster) => {
              broadcaster.broadcastTx(
                Uint8Array.from(txRawBytes)
              ).then(
                (data)=>{
                  console.log(data.transactionHash)
                  window.alert("Tx Hash :    " +  data.transactionHash.toString())
                  return data
                }
              );
            }
          );
        })
      return ans
  
    }catch(error){
      return null
    }
  
}
