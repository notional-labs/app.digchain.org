"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const amino_1 = require("@cosmjs/amino");
const utils_1 = require("@cosmjs/utils");
const cosmosclient_1 = require("../cosmosclient");
const logs_1 = require("../logs");
const signingcosmosclient_1 = require("../signingcosmosclient");
const cosmoshub_json_1 = __importDefault(require("../testdata/cosmoshub.json"));
const testutils_spec_1 = require("../testutils.spec");
const tx_1 = require("../tx");
const auth_1 = require("./auth");
const lcdclient_1 = require("./lcdclient");
describe("LcdClient", () => {
    const defaultRecipientAddress = testutils_spec_1.makeRandomAddress();
    it("can be constructed", () => {
        const client = new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint);
        expect(client).toBeTruthy();
    });
    describe("withModules", () => {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        function setupSupplyExtension(base) {
            return {
                supply: {
                    totalAll: async () => {
                        return base.get(`/supply/total`);
                    },
                },
            };
        }
        function setupBankExtension(base) {
            return {
                bank: {
                    balances: async (address) => {
                        const path = `/bank/balances/${address}`;
                        return base.get(path);
                    },
                },
            };
        }
        it("works for no extension", async () => {
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint });
            expect(client).toBeTruthy();
        });
        it("works for one extension", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint }, setupSupplyExtension);
            const supply = await client.supply.totalAll();
            expect(supply).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    {
                        amount: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                        denom: "ucosm",
                    },
                    {
                        amount: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                        denom: "ustake",
                    },
                ],
            });
        });
        it("works for two extensions", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint }, setupSupplyExtension, setupBankExtension);
            const supply = await client.supply.totalAll();
            expect(supply).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    {
                        amount: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                        denom: "ucosm",
                    },
                    {
                        amount: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                        denom: "ustake",
                    },
                ],
            });
            const balances = await client.bank.balances(testutils_spec_1.unused.address);
            expect(balances).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    {
                        denom: "ucosm",
                        amount: "1000000000",
                    },
                    {
                        denom: "ustake",
                        amount: "1000000000",
                    },
                ],
            });
        });
        it("can merge two extensions into the same module", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            function setupSupplyExtensionBasic(base) {
                return {
                    supply: {
                        totalAll: async () => {
                            const path = `/supply/total`;
                            return base.get(path);
                        },
                    },
                };
            }
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            function setupSupplyExtensionPremium(base) {
                return {
                    supply: {
                        total: async (denom) => {
                            return base.get(`/supply/total/${denom}`);
                        },
                    },
                };
            }
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint }, setupSupplyExtensionBasic, setupSupplyExtensionPremium);
            expect(client.supply.totalAll).toEqual(jasmine.any(Function));
            expect(client.supply.total).toEqual(jasmine.any(Function));
        });
    });
    // The /txs endpoints
    describe("txById", () => {
        let successful;
        let unsuccessful;
        beforeAll(async () => {
            if (testutils_spec_1.launchpadEnabled()) {
                const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
                const accounts = await wallet.getAccounts();
                const [{ address: walletAddress }] = accounts;
                const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet);
                {
                    const recipient = testutils_spec_1.makeRandomAddress();
                    const amount = amino_1.coins(1234567, "ucosm");
                    const result = await client.sendTokens(recipient, amount);
                    successful = {
                        sender: testutils_spec_1.faucet.address0,
                        recipient: recipient,
                        hash: result.transactionHash,
                    };
                }
                {
                    const memo = "Sending more than I can afford";
                    const recipient = testutils_spec_1.makeRandomAddress();
                    const amount = amino_1.coins(123456700000000, "ucosm");
                    const sendMsg = {
                        type: "cosmos-sdk/MsgSend",
                        value: {
                            from_address: testutils_spec_1.faucet.address0,
                            to_address: recipient,
                            amount: amount,
                        },
                    };
                    const fee = {
                        amount: amino_1.coins(2000, "ucosm"),
                        gas: "80000", // 80k
                    };
                    const { accountNumber, sequence } = await client.getSequence();
                    const chainId = await client.getChainId();
                    const signDoc = amino_1.makeSignDoc([sendMsg], fee, chainId, memo, accountNumber, sequence);
                    const { signed, signature } = await wallet.signAmino(walletAddress, signDoc);
                    const signedTx = tx_1.makeStdTx(signed, signature);
                    const transactionId = await client.getIdentifier({ type: "cosmos-sdk/StdTx", value: signedTx });
                    const result = await client.broadcastTx(signedTx);
                    utils_1.assert(cosmosclient_1.isBroadcastTxFailure(result));
                    unsuccessful = {
                        sender: testutils_spec_1.faucet.address0,
                        recipient: recipient,
                        hash: transactionId,
                    };
                }
                await utils_1.sleep(75); // wait until transactions are indexed
            }
        });
        it("works for successful transaction", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            utils_1.assert(successful);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint);
            const result = await client.txById(successful.hash);
            expect(result.height).toBeGreaterThanOrEqual(1);
            expect(result.txhash).toEqual(successful.hash);
            expect(result.codespace).toBeUndefined();
            expect(result.code).toBeUndefined();
            const logs = logs_1.parseLogs(result.logs);
            expect(logs).toEqual([
                {
                    msg_index: 0,
                    log: "",
                    events: [
                        {
                            type: "message",
                            attributes: [
                                { key: "action", value: "send" },
                                { key: "sender", value: successful.sender },
                                { key: "module", value: "bank" },
                            ],
                        },
                        {
                            type: "transfer",
                            attributes: [
                                { key: "recipient", value: successful.recipient },
                                { key: "sender", value: successful.sender },
                                { key: "amount", value: "1234567ucosm" },
                            ],
                        },
                    ],
                },
            ]);
        });
        it("works for unsuccessful transaction", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            utils_1.assert(unsuccessful);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint);
            const result = await client.txById(unsuccessful.hash);
            expect(result.height).toBeGreaterThanOrEqual(1);
            expect(result.txhash).toEqual(unsuccessful.hash);
            expect(result.codespace).toEqual("sdk");
            expect(result.code).toEqual(5);
            expect(result.logs).toBeUndefined();
            expect(result.raw_log).toContain("insufficient funds");
        });
    });
    describe("txsQuery", () => {
        let broadcasted;
        beforeAll(async () => {
            if (testutils_spec_1.launchpadEnabled()) {
                const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
                const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet);
                const recipient = testutils_spec_1.makeRandomAddress();
                const amount = amino_1.coins(1234567, "ucosm");
                const result = await client.sendTokens(recipient, amount);
                await utils_1.sleep(75); // wait until tx is indexed
                const txDetails = await new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint).txById(result.transactionHash);
                broadcasted = {
                    sender: testutils_spec_1.faucet.address0,
                    recipient: recipient,
                    hash: result.transactionHash,
                    height: Number.parseInt(txDetails.height, 10),
                    tx: txDetails,
                };
            }
        });
        it("can query transactions by height", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            utils_1.assert(broadcasted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint);
            const result = await client.txsQuery(`tx.height=${broadcasted.height}&limit=26`);
            expect(result).toEqual({
                count: jasmine.stringMatching(/^(1|2|3|4|5)$/),
                limit: "26",
                page_number: "1",
                page_total: "1",
                total_count: jasmine.stringMatching(/^(1|2|3|4|5)$/),
                txs: jasmine.arrayContaining([broadcasted.tx]),
            });
        });
        it("can query transactions by ID", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            utils_1.assert(broadcasted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint);
            const result = await client.txsQuery(`tx.hash=${broadcasted.hash}&limit=26`);
            expect(result).toEqual({
                count: "1",
                limit: "26",
                page_number: "1",
                page_total: "1",
                total_count: "1",
                txs: [broadcasted.tx],
            });
        });
        it("can query transactions by sender", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            utils_1.assert(broadcasted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint);
            const result = await client.txsQuery(`message.sender=${broadcasted.sender}&limit=200`);
            expect(parseInt(result.count, 10)).toBeGreaterThanOrEqual(1);
            expect(parseInt(result.limit, 10)).toEqual(200);
            expect(parseInt(result.page_number, 10)).toEqual(1);
            expect(parseInt(result.page_total, 10)).toEqual(1);
            expect(parseInt(result.total_count, 10)).toBeGreaterThanOrEqual(1);
            expect(result.txs.length).toBeGreaterThanOrEqual(1);
            expect(result.txs[result.txs.length - 1]).toEqual(broadcasted.tx);
        });
        it("can query transactions by recipient", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            utils_1.assert(broadcasted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint);
            const result = await client.txsQuery(`transfer.recipient=${broadcasted.recipient}&limit=200`);
            expect(parseInt(result.count, 10)).toEqual(1);
            expect(parseInt(result.limit, 10)).toEqual(200);
            expect(parseInt(result.page_number, 10)).toEqual(1);
            expect(parseInt(result.page_total, 10)).toEqual(1);
            expect(parseInt(result.total_count, 10)).toEqual(1);
            expect(result.txs.length).toBeGreaterThanOrEqual(1);
            expect(result.txs[result.txs.length - 1]).toEqual(broadcasted.tx);
        });
        it("can filter by tx.hash and tx.minheight", async () => {
            pending("This combination is broken 🤷‍♂️. Handle client-side at higher level.");
            testutils_spec_1.pendingWithoutLaunchpad();
            utils_1.assert(broadcasted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint);
            const hashQuery = `tx.hash=${broadcasted.hash}`;
            {
                const { count } = await client.txsQuery(`${hashQuery}&tx.minheight=0`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${hashQuery}&tx.minheight=${broadcasted.height - 1}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${hashQuery}&tx.minheight=${broadcasted.height}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${hashQuery}&tx.minheight=${broadcasted.height + 1}`);
                expect(count).toEqual("0");
            }
        });
        it("can filter by recipient and tx.minheight", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            utils_1.assert(broadcasted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint);
            const recipientQuery = `transfer.recipient=${broadcasted.recipient}`;
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.minheight=0`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.minheight=${broadcasted.height - 1}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.minheight=${broadcasted.height}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.minheight=${broadcasted.height + 1}`);
                expect(count).toEqual("0");
            }
        });
        it("can filter by recipient and tx.maxheight", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            utils_1.assert(broadcasted);
            const client = new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint);
            const recipientQuery = `transfer.recipient=${broadcasted.recipient}`;
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.maxheight=9999999999999`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.maxheight=${broadcasted.height + 1}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.maxheight=${broadcasted.height}`);
                expect(count).toEqual("1");
            }
            {
                const { count } = await client.txsQuery(`${recipientQuery}&tx.maxheight=${broadcasted.height - 1}`);
                expect(count).toEqual("0");
            }
        });
    });
    describe("encodeTx", () => {
        it("works for cosmoshub example", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = new lcdclient_1.LcdClient(testutils_spec_1.launchpad.endpoint);
            utils_1.assert(tx_1.isWrappedStdTx(cosmoshub_json_1.default.tx));
            const response = await client.encodeTx(cosmoshub_json_1.default.tx);
            expect(response).toEqual(jasmine.objectContaining({
                tx: cosmoshub_json_1.default.tx_data,
            }));
        });
    });
    describe("broadcastTx", () => {
        it("can send tokens", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const accounts = await wallet.getAccounts();
            const [{ address: walletAddress }] = accounts;
            const memo = "My first contract on chain";
            const theMsg = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: testutils_spec_1.faucet.address0,
                    to_address: defaultRecipientAddress,
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
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint }, auth_1.setupAuthExtension);
            const { account_number, sequence } = (await client.auth.account(testutils_spec_1.faucet.address0)).result.value;
            const signDoc = amino_1.makeSignDoc([theMsg], fee, testutils_spec_1.launchpad.chainId, memo, account_number, sequence);
            const { signed, signature } = await wallet.signAmino(walletAddress, signDoc);
            const signedTx = tx_1.makeStdTx(signed, signature);
            const result = await client.broadcastTx(signedTx);
            expect(result.code).toBeUndefined();
            expect(result).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                txhash: jasmine.stringMatching(testutils_spec_1.tendermintIdMatcher),
                // code is not set
                raw_log: jasmine.stringMatching(/^\[.+\]$/i),
                logs: jasmine.any(Array),
                gas_wanted: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                gas_used: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
            });
        });
        it("can't send transaction with additional signatures", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const account1 = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, {
                hdPaths: [amino_1.makeCosmoshubPath(0)],
            });
            const account2 = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, {
                hdPaths: [amino_1.makeCosmoshubPath(1)],
            });
            const account3 = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, {
                hdPaths: [amino_1.makeCosmoshubPath(2)],
            });
            const [address1, address2, address3] = await Promise.all([account1, account2, account3].map(async (wallet) => {
                return (await wallet.getAccounts())[0].address;
            }));
            const memo = "My first contract on chain";
            const theMsg = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address1,
                    to_address: defaultRecipientAddress,
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
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint }, auth_1.setupAuthExtension);
            const { account_number: an1, sequence: sequence1 } = (await client.auth.account(address1)).result.value;
            const { account_number: an2, sequence: sequence2 } = (await client.auth.account(address2)).result.value;
            const { account_number: an3, sequence: sequence3 } = (await client.auth.account(address3)).result.value;
            const signDoc1 = amino_1.makeSignDoc([theMsg], fee, testutils_spec_1.launchpad.chainId, memo, an1, sequence1);
            const signDoc2 = amino_1.makeSignDoc([theMsg], fee, testutils_spec_1.launchpad.chainId, memo, an2, sequence2);
            const signDoc3 = amino_1.makeSignDoc([theMsg], fee, testutils_spec_1.launchpad.chainId, memo, an3, sequence3);
            const { signature: signature1 } = await account1.signAmino(address1, signDoc1);
            const { signature: signature2 } = await account2.signAmino(address2, signDoc2);
            const { signature: signature3 } = await account3.signAmino(address3, signDoc3);
            const signedTx = {
                msg: [theMsg],
                fee: fee,
                memo: memo,
                signatures: [signature1, signature2, signature3],
            };
            const broadcastResult = await client.broadcastTx(signedTx);
            expect(broadcastResult.code).toEqual(4);
            expect(broadcastResult.raw_log).toContain("wrong number of signers");
        });
        it("can send multiple messages with one signature", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const accounts = await wallet.getAccounts();
            const [{ address: walletAddress }] = accounts;
            const memo = "My first contract on chain";
            const msg1 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: walletAddress,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                },
            };
            const msg2 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: walletAddress,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "7654321",
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
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint }, auth_1.setupAuthExtension);
            const { account_number, sequence } = (await client.auth.account(walletAddress)).result.value;
            const signDoc = amino_1.makeSignDoc([msg1, msg2], fee, testutils_spec_1.launchpad.chainId, memo, account_number, sequence);
            const { signed, signature } = await wallet.signAmino(walletAddress, signDoc);
            const signedTx = tx_1.makeStdTx(signed, signature);
            const broadcastResult = await client.broadcastTx(signedTx);
            expect(broadcastResult.code).toBeUndefined();
        });
        it("can send multiple messages with multiple signatures", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const account1 = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, {
                hdPaths: [amino_1.makeCosmoshubPath(0)],
            });
            const account2 = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, {
                hdPaths: [amino_1.makeCosmoshubPath(1)],
            });
            const [address1, address2] = await Promise.all([account1, account2].map(async (wallet) => {
                return (await wallet.getAccounts())[0].address;
            }));
            const memo = "My first contract on chain";
            const msg1 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address1,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                },
            };
            const msg2 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address2,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "7654321",
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
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint }, auth_1.setupAuthExtension);
            const { account_number: an1, sequence: sequence1 } = (await client.auth.account(address1)).result.value;
            const { account_number: an2, sequence: sequence2 } = (await client.auth.account(address2)).result.value;
            const signDoc1 = amino_1.makeSignDoc([msg2, msg1], fee, testutils_spec_1.launchpad.chainId, memo, an1, sequence1);
            const signDoc2 = amino_1.makeSignDoc([msg2, msg1], fee, testutils_spec_1.launchpad.chainId, memo, an2, sequence2);
            const { signature: signature1 } = await account1.signAmino(address1, signDoc1);
            const { signature: signature2 } = await account2.signAmino(address2, signDoc2);
            const signedTx = {
                msg: [msg2, msg1],
                fee: fee,
                memo: memo,
                signatures: [signature2, signature1],
            };
            const broadcastResult = await client.broadcastTx(signedTx);
            expect(broadcastResult.code).toBeUndefined();
            await utils_1.sleep(500);
            const searched = await client.txsQuery(`tx.hash=${broadcastResult.txhash}`);
            expect(searched.txs.length).toEqual(1);
            expect(searched.txs[0].tx.value.signatures).toEqual([signature2, signature1]);
        });
        it("can't send transaction with wrong signature order (1)", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const account1 = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, {
                hdPaths: [amino_1.makeCosmoshubPath(0)],
            });
            const account2 = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, {
                hdPaths: [amino_1.makeCosmoshubPath(1)],
            });
            const [address1, address2] = await Promise.all([account1, account2].map(async (wallet) => {
                return (await wallet.getAccounts())[0].address;
            }));
            const memo = "My first contract on chain";
            const msg1 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address1,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                },
            };
            const msg2 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address2,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "7654321",
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
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint }, auth_1.setupAuthExtension);
            const { account_number: an1, sequence: sequence1 } = (await client.auth.account(address1)).result.value;
            const { account_number: an2, sequence: sequence2 } = (await client.auth.account(address2)).result.value;
            const signDoc1 = amino_1.makeSignDoc([msg1, msg2], fee, testutils_spec_1.launchpad.chainId, memo, an1, sequence1);
            const signDoc2 = amino_1.makeSignDoc([msg1, msg2], fee, testutils_spec_1.launchpad.chainId, memo, an2, sequence2);
            const { signature: signature1 } = await account1.signAmino(address1, signDoc1);
            const { signature: signature2 } = await account2.signAmino(address2, signDoc2);
            const signedTx = {
                msg: [msg1, msg2],
                fee: fee,
                memo: memo,
                signatures: [signature2, signature1],
            };
            const broadcastResult = await client.broadcastTx(signedTx);
            expect(broadcastResult.code).toEqual(8);
        });
        it("can't send transaction with wrong signature order (2)", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const account1 = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, {
                hdPaths: [amino_1.makeCosmoshubPath(0)],
            });
            const account2 = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic, {
                hdPaths: [amino_1.makeCosmoshubPath(1)],
            });
            const [address1, address2] = await Promise.all([account1, account2].map(async (wallet) => {
                return (await wallet.getAccounts())[0].address;
            }));
            const memo = "My first contract on chain";
            const msg1 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address1,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "1234567",
                        },
                    ],
                },
            };
            const msg2 = {
                type: "cosmos-sdk/MsgSend",
                value: {
                    from_address: address2,
                    to_address: defaultRecipientAddress,
                    amount: [
                        {
                            denom: "ucosm",
                            amount: "7654321",
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
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint }, auth_1.setupAuthExtension);
            const { account_number: an1, sequence: sequence1 } = (await client.auth.account(address1)).result.value;
            const { account_number: an2, sequence: sequence2 } = (await client.auth.account(address2)).result.value;
            const signDoc1 = amino_1.makeSignDoc([msg2, msg1], fee, testutils_spec_1.launchpad.chainId, memo, an1, sequence1);
            const signDoc2 = amino_1.makeSignDoc([msg2, msg1], fee, testutils_spec_1.launchpad.chainId, memo, an2, sequence2);
            const { signature: signature1 } = await account1.signAmino(address1, signDoc1);
            const { signature: signature2 } = await account2.signAmino(address2, signDoc2);
            const signedTx = {
                msg: [msg2, msg1],
                fee: fee,
                memo: memo,
                signatures: [signature1, signature2],
            };
            const broadcastResult = await client.broadcastTx(signedTx);
            expect(broadcastResult.code).toEqual(8);
        });
    });
});
//# sourceMappingURL=lcdclient.spec.js.map