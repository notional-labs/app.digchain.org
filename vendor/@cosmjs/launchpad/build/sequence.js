"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSequenceForSignedTx = void 0;
const amino_1 = require("@cosmjs/amino");
const crypto_1 = require("@cosmjs/crypto");
/**
 * Serach for sequence s with `min` <= `s` < `upperBound` to find the sequence that was used to sign the transaction
 *
 * @param tx The signed transaction
 * @param chainId The chain ID for which this transaction was signed
 * @param accountNumber The account number for which this transaction was signed
 * @param upperBound The upper bound for the testing, i.e. sequence must be lower than this value
 * @param min The lowest sequence that is tested
 *
 * @returns the sequence if a match was found and undefined otherwise
 */
async function findSequenceForSignedTx(tx, chainId, accountNumber, upperBound, min = 0) {
    const firstSignature = tx.value.signatures.find(() => true);
    if (!firstSignature)
        throw new Error("Signature missing in tx");
    const { pubkey, signature } = amino_1.decodeSignature(firstSignature);
    const secp256keSignature = crypto_1.Secp256k1Signature.fromFixedLength(signature);
    for (let s = min; s < upperBound; s++) {
        // console.log(`Trying sequence ${s}`);
        const signBytes = amino_1.serializeSignDoc(amino_1.makeSignDoc(tx.value.msg, tx.value.fee, chainId, tx.value.memo || "", accountNumber, s));
        const prehashed = crypto_1.sha256(signBytes);
        const valid = await crypto_1.Secp256k1.verifySignature(secp256keSignature, prehashed, pubkey);
        if (valid)
            return s;
    }
    return undefined;
}
exports.findSequenceForSignedTx = findSequenceForSignedTx;
//# sourceMappingURL=sequence.js.map