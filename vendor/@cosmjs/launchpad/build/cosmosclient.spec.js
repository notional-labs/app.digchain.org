"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const amino_1 = require("@cosmjs/amino");
const utils_1 = require("@cosmjs/utils");
const readonly_date_1 = require("readonly-date");
const cosmosclient_1 = require("./cosmosclient");
const logs_1 = require("./logs");
const cosmoshub_json_1 = __importDefault(require("./testdata/cosmoshub.json"));
const testutils_spec_1 = require("./testutils.spec");
const tx_1 = require("./tx");
const blockTime = 1000; // ms
const guest = {
    address: "cosmos17d0jcz59jf68g52vq38tuuncmwwjk42u6mcxej",
};
describe("CosmosClient", () => {
    describe("constructor", () => {
        it("can be constructed", () => {
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            expect(client).toBeTruthy();
        });
    });
    describe("getChainId", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            expect(await client.getChainId()).toEqual(testutils_spec_1.launchpad.chainId);
        });
        it("caches chain ID", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            const openedClient = client;
            const getCodeSpy = spyOn(openedClient.lcdClient, "nodeInfo").and.callThrough();
            expect(await client.getChainId()).toEqual(testutils_spec_1.launchpad.chainId); // from network
            expect(await client.getChainId()).toEqual(testutils_spec_1.launchpad.chainId); // from cache
            expect(getCodeSpy).toHaveBeenCalledTimes(1);
        });
    });
    describe("getHeight", () => {
        it("gets height via last block", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            const openedClient = client;
            const blockLatestSpy = spyOn(openedClient.lcdClient, "blocksLatest").and.callThrough();
            const height1 = await client.getHeight();
            expect(height1).toBeGreaterThan(0);
            await utils_1.sleep(blockTime * 1.4); // tolerate chain being 40% slower than expected
            const height2 = await client.getHeight();
            expect(height2).toBeGreaterThanOrEqual(height1 + 1);
            expect(height2).toBeLessThanOrEqual(height1 + 2);
            expect(blockLatestSpy).toHaveBeenCalledTimes(2);
        });
        it("gets height via authAccount once an address is known", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            const openedClient = client;
            const blockLatestSpy = spyOn(openedClient.lcdClient, "blocksLatest").and.callThrough();
            const authAccountsSpy = spyOn(openedClient.lcdClient.auth, "account").and.callThrough();
            const height1 = await client.getHeight();
            expect(height1).toBeGreaterThan(0);
            await client.getAccount(guest.address); // warm up the client
            const height2 = await client.getHeight();
            expect(height2).toBeGreaterThan(0);
            await utils_1.sleep(blockTime * 1.3); // tolerate chain being 30% slower than expected
            const height3 = await client.getHeight();
            expect(height3).toBeGreaterThanOrEqual(height2 + 1);
            expect(height3).toBeLessThanOrEqual(height2 + 2);
            expect(blockLatestSpy).toHaveBeenCalledTimes(1);
            expect(authAccountsSpy).toHaveBeenCalledTimes(3);
        });
    });
    describe("getSequence", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            expect(await client.getSequence(testutils_spec_1.unused.address)).toEqual({
                accountNumber: testutils_spec_1.unused.accountNumber,
                sequence: testutils_spec_1.unused.sequence,
            });
        });
        it("throws for missing accounts", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            const missing = testutils_spec_1.makeRandomAddress();
            await client.getSequence(missing).then(() => fail("this must not succeed"), (error) => expect(error).toMatch(/account does not exist on chain/i));
        });
    });
    describe("getAccount", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            expect(await client.getAccount(testutils_spec_1.unused.address)).toEqual({
                address: testutils_spec_1.unused.address,
                accountNumber: testutils_spec_1.unused.accountNumber,
                sequence: testutils_spec_1.unused.sequence,
                pubkey: undefined,
                balance: [
                    { denom: "ucosm", amount: "1000000000" },
                    { denom: "ustake", amount: "1000000000" },
                ],
            });
        });
        it("returns undefined for missing accounts", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            const missing = testutils_spec_1.makeRandomAddress();
            expect(await client.getAccount(missing)).toBeUndefined();
        });
    });
    describe("getBlock", () => {
        it("works for latest block", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.getBlock();
            expect(response).toEqual(jasmine.objectContaining({
                id: jasmine.stringMatching(testutils_spec_1.tendermintIdMatcher),
                header: jasmine.objectContaining({
                    chainId: await client.getChainId(),
                }),
                txs: [],
            }));
            expect(response.header.height).toBeGreaterThanOrEqual(1);
            expect(new readonly_date_1.ReadonlyDate(response.header.time).getTime()).toBeLessThan(readonly_date_1.ReadonlyDate.now());
            expect(new readonly_date_1.ReadonlyDate(response.header.time).getTime()).toBeGreaterThanOrEqual(readonly_date_1.ReadonlyDate.now() - 5000);
        });
        it("works for block by height", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            const height = (await client.getBlock()).header.height;
            const response = await client.getBlock(height - 1);
            expect(response).toEqual(jasmine.objectContaining({
                id: jasmine.stringMatching(testutils_spec_1.tendermintIdMatcher),
                header: jasmine.objectContaining({
                    height: height - 1,
                    chainId: await client.getChainId(),
                }),
                txs: [],
            }));
            expect(new readonly_date_1.ReadonlyDate(response.header.time).getTime()).toBeLessThan(readonly_date_1.ReadonlyDate.now());
            expect(new readonly_date_1.ReadonlyDate(response.header.time).getTime()).toBeGreaterThanOrEqual(readonly_date_1.ReadonlyDate.now() - 5000);
        });
    });
    describe("getIdentifier", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            utils_1.assert(tx_1.isWrappedStdTx(cosmoshub_json_1.default.tx));
            expect(await client.getIdentifier(cosmoshub_json_1.default.tx)).toEqual(cosmoshub_json_1.default.id);
        });
    });
    describe("broadcastTx", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const accounts = await wallet.getAccounts();
            const [{ address: walletAddress }] = accounts;
            const client = new cosmosclient_1.CosmosClient(testutils_spec_1.launchpad.endpoint);
            const memo = "Test send";
            const sendMsg = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: testutils_spec_1.faucet.address0,
                    to_address: testutils_spec_1.makeRandomAddress(),
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                },
            };
            const fee = {
                amount: [
                    {
                        amount: "5000",
                        denom: "ucosm",
                    },
                ],
                gas: "890000",
            };
            const chainId = await client.getChainId();
            const { accountNumber, sequence } = await client.getSequence(testutils_spec_1.faucet.address0);
            const signDoc = amino_1.makeSignDoc([sendMsg], fee, chainId, memo, accountNumber, sequence);
            const { signed, signature } = await wallet.signAmino(walletAddress, signDoc);
            const signedTx = tx_1.makeStdTx(signed, signature);
            const txResult = await client.broadcastTx(signedTx);
            cosmosclient_1.assertIsBroadcastTxSuccess(txResult);
            const { logs, transactionHash } = txResult;
            const amountAttr = logs_1.findAttribute(logs, "transfer", "amount");
            expect(amountAttr.value).toEqual("1234567ucosm");
            expect(transactionHash).toMatch(/^[0-9A-F]{64}$/);
        });
    });
});
//# sourceMappingURL=cosmosclient.spec.js.map