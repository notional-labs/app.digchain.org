import Web3 from 'web3';
import { publicKeyConvert } from 'secp256k1';
import { extractPublicKey } from '@metamask/eth-sig-util'
import { toHexString, fromHexString} from './util'

/**
 * 
 * @returns {Web3} web3 instance
 */
 export async function getWeb3Instance(){
    // Empty web3 instance
    if (typeof window.ethereum === 'undefined') {
        window.alert("Meta mask is not present");
        return null;
    }
  
    // Instance web3 with the provided information from the MetaMask provider information
    let web3 = new Web3(window.ethereum);
    try {
        // Request account access
        await window.ethereum.enable();
    } catch (e) {
        // Handle user denied access
        return null;
    }

    return web3;
}

export function removeLeading0x(str) {
    if (str.startsWith('0x'))
        return str.substring(2);
    else return str;
}

export function addLeading0x(str) {
    if (!str.startsWith('0x'))
        return '0x' + str;
    else return str;
}

export function compress(startsWith04) {

    // add trailing 04 if not done before
    const testBuffer = Buffer.from(startsWith04, 'hex');
    if (testBuffer.length === 64) startsWith04 = '04' + startsWith04;


    return toHexString(publicKeyConvert(
        fromHexString(startsWith04),
        true
    ));
}


export function getUint8ArrayPubKeyFromSignatureData(data){
    const pubKey = extractPublicKey({
        data: data.data,
        signature: data.signature
    });
    
    const compressedPubKeyHex = compress(pubKey.slice(2));
    return fromHexString(compressedPubKeyHex)
}
