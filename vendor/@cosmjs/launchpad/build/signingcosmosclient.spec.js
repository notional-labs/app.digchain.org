"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const amino_1 = require("@cosmjs/amino");
const utils_1 = require("@cosmjs/utils");
const cosmosclient_1 = require("./cosmosclient");
const fee_1 = require("./fee");
const signingcosmosclient_1 = require("./signingcosmosclient");
const testutils_spec_1 = require("./testutils.spec");
describe("SigningCosmosClient", () => {
    describe("makeReadOnly", () => {
        it("can be constructed with default fees", async () => {
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet);
            const openedClient = client;
            expect(openedClient.fees).toEqual({
                send: {
                    amount: [
                        {
                            amount: "2000",
                            denom: "ucosm",
                        },
                    ],
                    gas: "80000",
                },
            });
        });
        it("can be constructed with custom gas price", async () => {
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const gasPrice = fee_1.GasPrice.fromString("3.14utest");
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet, gasPrice);
            const openedClient = client;
            expect(openedClient.fees).toEqual({
                send: {
                    amount: [
                        {
                            amount: "251200",
                            denom: "utest",
                        },
                    ],
                    gas: "80000",
                },
            });
        });
        it("can be constructed with custom gas limits", async () => {
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const gasLimits = {
                send: 160000,
            };
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet, undefined, gasLimits);
            const openedClient = client;
            expect(openedClient.fees).toEqual({
                send: {
                    amount: [
                        {
                            amount: "4000",
                            denom: "ucosm",
                        },
                    ],
                    gas: "160000",
                },
            });
        });
        it("can be constructed with custom gas price and gas limits", async () => {
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const gasPrice = fee_1.GasPrice.fromString("3.14utest");
            const gasLimits = {
                send: 160000,
            };
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet, gasPrice, gasLimits);
            const openedClient = client;
            expect(openedClient.fees).toEqual({
                send: {
                    amount: [
                        {
                            amount: "502400",
                            denom: "utest",
                        },
                    ],
                    gas: "160000",
                },
            });
        });
    });
    describe("getHeight", () => {
        it("always uses authAccount implementation", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet);
            const openedClient = client;
            const blockLatestSpy = spyOn(openedClient.lcdClient, "blocksLatest").and.callThrough();
            const authAccountsSpy = spyOn(openedClient.lcdClient.auth, "account").and.callThrough();
            const height = await client.getHeight();
            expect(height).toBeGreaterThan(0);
            expect(blockLatestSpy).toHaveBeenCalledTimes(0);
            expect(authAccountsSpy).toHaveBeenCalledTimes(1);
        });
    });
    describe("sendTokens", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet);
            const amount = amino_1.coins(7890, "ucosm");
            const beneficiaryAddress = testutils_spec_1.makeRandomAddress();
            // no tokens here
            const before = await client.getAccount(beneficiaryAddress);
            expect(before).toBeUndefined();
            // send
            const result = await client.sendTokens(beneficiaryAddress, amount, "for dinner");
            cosmosclient_1.assertIsBroadcastTxSuccess(result);
            const [firstLog] = result.logs;
            expect(firstLog).toBeTruthy();
            // got tokens
            const after = await client.getAccount(beneficiaryAddress);
            utils_1.assert(after);
            expect(after.balance).toEqual(amount);
        });
    });
    describe("signAndBroadcast", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet);
            const msg = {
                type: "cosmos-sdk/MsgDelegate",
                value: {
                    delegator_address: testutils_spec_1.faucet.address0,
                    validator_address: testutils_spec_1.launchpad.validator.address,
                    amount: amino_1.coin(1234, "ustake"),
                },
            };
            const fee = {
                amount: amino_1.coins(2000, "ucosm"),
                gas: "180000", // 180k
            };
            const result = await client.signAndBroadcast([msg], fee, "Use your power wisely");
            cosmosclient_1.assertIsBroadcastTxSuccess(result);
        });
    });
    describe("sign", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet);
            const msg1 = {
                type: "cosmos-sdk/MsgDelegate",
                value: {
                    delegator_address: testutils_spec_1.faucet.address0,
                    validator_address: testutils_spec_1.launchpad.validator.address,
                    amount: amino_1.coin(1234, "ustake"),
                },
            };
            const msg2 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: testutils_spec_1.faucet.address0,
                    to_address: testutils_spec_1.makeRandomAddress(),
                    amount: amino_1.coins(1234567, "ucosm"),
                },
            };
            const fee = {
                amount: amino_1.coins(2000, "ucosm"),
                gas: "180000", // 180k
            };
            const memo = "Use your power wisely";
            const signed = await client.sign([msg1, msg2], fee, memo);
            expect(signed.msg).toEqual([msg1, msg2]);
            expect(signed.fee).toEqual(fee);
            expect(signed.memo).toEqual(memo);
            expect(signed.signatures).toEqual([
                {
                    pub_key: testutils_spec_1.faucet.pubkey0,
                    signature: jasmine.stringMatching(testutils_spec_1.base64Matcher),
                },
            ]);
            // Ensure signed transaction is valid
            const broadcastResult = await client.broadcastTx(signed);
            cosmosclient_1.assertIsBroadcastTxSuccess(broadcastResult);
        });
    });
    describe("appendSignature", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const wallet0 = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, {
                hdPaths: [amino_1.makeCosmoshubPath(0)],
            });
            const wallet1 = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, {
                hdPaths: [amino_1.makeCosmoshubPath(1)],
            });
            const client0 = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet0);
            const client1 = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address1, wallet1);
            const msg1 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: testutils_spec_1.faucet.address0,
                    to_address: testutils_spec_1.makeRandomAddress(),
                    amount: amino_1.coins(1234567, "ucosm"),
                },
            };
            const msg2 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: testutils_spec_1.faucet.address1,
                    to_address: testutils_spec_1.makeRandomAddress(),
                    amount: amino_1.coins(1234567, "ucosm"),
                },
            };
            const fee = {
                amount: amino_1.coins(2000, "ucosm"),
                gas: "160000", // 2*80k
            };
            const memo = "This must be authorized by the two of us";
            const signed = await client0.sign([msg1, msg2], fee, memo);
            const cosigned = await client1.appendSignature(signed);
            expect(cosigned.msg).toEqual([msg1, msg2]);
            expect(cosigned.fee).toEqual(fee);
            expect(cosigned.memo).toEqual(memo);
            expect(cosigned.signatures).toEqual([
                {
                    pub_key: testutils_spec_1.faucet.pubkey0,
                    signature: jasmine.stringMatching(testutils_spec_1.base64Matcher),
                },
                {
                    pub_key: testutils_spec_1.faucet.pubkey1,
                    signature: jasmine.stringMatching(testutils_spec_1.base64Matcher),
                },
            ]);
            // Ensure signed transaction is valid
            const broadcastResult = await client0.broadcastTx(cosigned);
            cosmosclient_1.assertIsBroadcastTxSuccess(broadcastResult);
        });
    });
});
//# sourceMappingURL=signingcosmosclient.spec.js.map