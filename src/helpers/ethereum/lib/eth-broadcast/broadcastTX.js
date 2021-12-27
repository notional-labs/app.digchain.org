import { makeAuthInfoBytes } from "../eth-transaction/Auth"
import { makeSignDocJsonString } from "../eth-transaction/Sign"
import { makeAuthInfoBytes, makeEthPubkeyFromByte, makePubKey} from "../eth-transaction/Auth";
import { makeRawTxBytes} from "../eth-transaction/Tx"
import { getUint8ArrayPubKey } from '../metamaskHelpers'
import { fetchAccount} from './fetch'

import { Registry } from "@cosmjs/proto-signing"
import { recoverPersonalSignature } from '@metamask/eth-sig-util'


function fromHexString (hexString){
  if (hexString.slice(0,2) == "0x") {
    return Uint8Array.from(Buffer.from(hexString.slice(2), 'hex'));
  }
  return Uint8Array.from(Buffer.from(hexString, 'hex'));
}

function getTxBodyBytesForSend(Msg, memo) {
  const registry = new Registry();
  let txBodyFields = {
    typeUrl: "/cosmos.tx.v1beta1.TxBody",
    value: {
      messages: [
        Msg
      ],
      memo: memo,
    },
  };
  const txBodyBytes = registry.encode(txBodyFields);
  return txBodyBytes
}

export function broadcastTransaction(address, msg, signDocMsg, chainId, memo, gasLimit, web3){
    let stdFeeToPutIntoSignDoc = {
        amount: [],
        gas: gasLimit.toString(),
      };

    let fee = {
        amount : [],
        gasLimit: gasLimit.toString(),
    }

    accountOnChain = fetchAccount(address)

    const signDocJsonString = makeSignDocJsonString(signDocMsg, stdFeeToPutIntoSignDoc, chainId, memo, accountOnChain.accountNumber, accountOnChain.sequence) 
    pubKeyBytes = getUint8ArrayPubKey({
      data: signDocJsonString,
      signature: result.result
    })
    const params = [address, signDocJsonString];
    const method = 'personal_sign';

    var pubKeyBytes = null;
    var signature_metamask = null;

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

          // verify signer
          const recovered = recoverPersonalSignature({
            data: signDocJsonString,
            signature: result.result,
          });

          if (
            toChecksumAddress(recovered) === toChecksumAddress(fromAddress)
          ) {
            alert('Successfully recovered signer as ' + fromAddress);
          } else {
            alert(
              'Failed to verify signer when comparinpubKeyBytesg ' + result + ' to ' + fromAddress
            );
          }

          signature_metamask = result.result
        }
      ).then(() => {
        const ethPubKey = makePubKey(pubKeyBytes)
        const bodyBytes = getTxBodyBytesForSend(msg, memo, registry) 
        const authInfoBytes = makeAuthInfoBytes(fee, ethPubKey, mode, sequence)
        const signature = fromHexString(signature_metamask)
        const txRawBytes = makeRawTxBytes(authInfoBytes, bodyBytes, [signature])

        StargateClient.connect(node).then(
          (broadcaster) => {
            const ans = broadcaster.broadcastTx(
              Uint8Array.from(txRawBytes)
            );
            console.log(ans)
          }
        );        
      })
}
