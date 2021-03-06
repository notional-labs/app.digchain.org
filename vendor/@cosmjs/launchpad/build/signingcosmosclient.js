"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigningCosmosClient = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const amino_1 = require("@cosmjs/amino");
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
const cosmosclient_1 = require("./cosmosclient");
const fee_1 = require("./fee");
const lcdapi_1 = require("./lcdapi");
const tx_1 = require("./tx");
const defaultGasPrice = fee_1.GasPrice.fromString("0.025ucosm");
const defaultGasLimits = { send: 80000 };
class SigningCosmosClient extends cosmosclient_1.CosmosClient {
    /**
     * Creates a new client with signing capability to interact with a Cosmos SDK blockchain. This is the bigger brother of CosmosClient.
     *
     * This instance does a lot of caching. In order to benefit from that you should try to use one instance
     * for the lifetime of your application. When switching backends, a new instance must be created.
     *
     * @param apiUrl The URL of a Cosmos SDK light client daemon API (sometimes called REST server or REST API)
     * @param signerAddress The address that will sign transactions using this instance. The `signer` must be able to sign with this address.
     * @param signer An implementation of OfflineAminoSigner which can provide signatures for transactions, potentially requiring user input.
     * @param gasPrice The price paid per unit of gas
     * @param gasLimits Custom overrides for gas limits related to specific transaction types
     * @param broadcastMode Defines at which point of the transaction processing the broadcastTx method returns
     */
    constructor(apiUrl, signerAddress, signer, gasPrice = defaultGasPrice, gasLimits = {}, broadcastMode = lcdapi_1.BroadcastMode.Block) {
        super(apiUrl, broadcastMode);
        this.anyValidAddress = signerAddress;
        this.signerAddress = signerAddress;
        this.signer = signer;
        this.fees = fee_1.buildFeeTable(gasPrice, defaultGasLimits, gasLimits);
    }
    async getSequence(address) {
        return super.getSequence(address || this.signerAddress);
    }
    async getAccount(address) {
        return super.getAccount(address || this.signerAddress);
    }
    async sendTokens(recipientAddress, amount, memo = "") {
        const sendMsg = {
            type: "cosmos-sdk/MsgSend",
            value: {
                from_address: this.signerAddress,
                to_address: recipientAddress,
                amount: amount,
            },
        };
        return this.signAndBroadcast([sendMsg], this.fees.send, memo);
    }
    /**
     * Gets account number and sequence from the API, creates a sign doc,
     * creates a single signature, assembles the signed transaction and broadcasts it.
     */
    async signAndBroadcast(msgs, fee, memo = "") {
        const signedTx = await this.sign(msgs, fee, memo);
        return this.broadcastTx(signedTx);
    }
    /**
     * Gets account number and sequence from the API, creates a sign doc,
     * creates a single signature and assembles the signed transaction.
     */
    async sign(msgs, fee, memo = "") {
        const { accountNumber, sequence } = await this.getSequence();
        const chainId = await this.getChainId();
        const signDoc = amino_1.makeSignDoc(msgs, fee, chainId, memo, accountNumber, sequence);
        const { signed, signature } = await this.signer.signAmino(this.signerAddress, signDoc);
        return tx_1.makeStdTx(signed, signature);
    }
    /**
     * Gets account number and sequence from the API, creates a sign doc,
     * creates a single signature and appends it to the existing signatures.
     */
    async appendSignature(signedTx) {
        const { msg: msgs, fee, memo } = signedTx;
        const { accountNumber, sequence } = await this.getSequence();
        const chainId = await this.getChainId();
        const signDoc = amino_1.makeSignDoc(msgs, fee, chainId, memo, accountNumber, sequence);
        const { signed, signature: additionalSignature } = await this.signer.signAmino(this.signerAddress, signDoc);
        if (!fast_deep_equal_1.default(signDoc, signed)) {
            throw new Error("The signed document differs from the one of the original transaction. This is not allowed since the resulting transaction will be invalid.");
        }
        return tx_1.makeStdTx(signed, [...signedTx.signatures, additionalSignature]);
    }
}
exports.SigningCosmosClient = SigningCosmosClient;
//# sourceMappingURL=signingcosmosclient.js.map