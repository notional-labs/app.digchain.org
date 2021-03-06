"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const paths_1 = require("./paths");
const secp256k1hdwallet_1 = require("./secp256k1hdwallet");
const signdoc_1 = require("./signdoc");
const testutils_spec_1 = require("./testutils.spec");
const wallet_1 = require("./wallet");
describe("Secp256k1HdWallet", () => {
    // m/44'/118'/0'/0/0
    // pubkey: 02baa4ef93f2ce84592a49b1d729c074eab640112522a7a89f7d03ebab21ded7b6
    const defaultMnemonic = "special sign fit simple patrol salute grocery chicken wheat radar tonight ceiling";
    const defaultPubkey = encoding_1.fromHex("02baa4ef93f2ce84592a49b1d729c074eab640112522a7a89f7d03ebab21ded7b6");
    const defaultAddress = "cosmos1jhg0e7s6gn44tfc5k37kr04sznyhedtc9rzys5";
    describe("fromMnemonic", () => {
        it("works", async () => {
            const wallet = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic(defaultMnemonic);
            expect(wallet).toBeTruthy();
            expect(wallet.mnemonic).toEqual(defaultMnemonic);
        });
        it("works with options", async () => {
            const wallet = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic(defaultMnemonic, {
                bip39Password: "password123",
                hdPaths: [paths_1.makeCosmoshubPath(123)],
                prefix: "yolo",
            });
            expect(wallet.mnemonic).toEqual(defaultMnemonic);
            const [account] = await wallet.getAccounts();
            expect(account.pubkey).not.toEqual(defaultPubkey);
            expect(account.address.slice(0, 4)).toEqual("yolo");
        });
        it("works with explicitly undefined options", async () => {
            const wallet = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic(defaultMnemonic, {
                bip39Password: undefined,
                hdPaths: undefined,
                prefix: undefined,
            });
            expect(wallet.mnemonic).toEqual(defaultMnemonic);
            const [account] = await wallet.getAccounts();
            expect(account.pubkey).toEqual(defaultPubkey);
            expect(account.address).toEqual(defaultAddress);
        });
    });
    describe("generate", () => {
        it("defaults to 12 words", async () => {
            const wallet = await secp256k1hdwallet_1.Secp256k1HdWallet.generate();
            expect(wallet.mnemonic.split(" ").length).toEqual(12);
        });
        it("can use different mnemonic lengths", async () => {
            expect((await secp256k1hdwallet_1.Secp256k1HdWallet.generate(12)).mnemonic.split(" ").length).toEqual(12);
            expect((await secp256k1hdwallet_1.Secp256k1HdWallet.generate(15)).mnemonic.split(" ").length).toEqual(15);
            expect((await secp256k1hdwallet_1.Secp256k1HdWallet.generate(18)).mnemonic.split(" ").length).toEqual(18);
            expect((await secp256k1hdwallet_1.Secp256k1HdWallet.generate(21)).mnemonic.split(" ").length).toEqual(21);
            expect((await secp256k1hdwallet_1.Secp256k1HdWallet.generate(24)).mnemonic.split(" ").length).toEqual(24);
        });
    });
    describe("deserialize", () => {
        it("can restore", async () => {
            const original = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic(defaultMnemonic);
            const password = "123";
            const serialized = await original.serialize(password);
            const deserialized = await secp256k1hdwallet_1.Secp256k1HdWallet.deserialize(serialized, password);
            const accounts = await deserialized.getAccounts();
            expect(deserialized.mnemonic).toEqual(defaultMnemonic);
            expect(accounts).toEqual([
                {
                    algo: "secp256k1",
                    address: defaultAddress,
                    pubkey: defaultPubkey,
                },
            ]);
        });
        it("can restore multiple accounts", async () => {
            const mnemonic = "economy stock theory fatal elder harbor betray wasp final emotion task crumble siren bottom lizard educate guess current outdoor pair theory focus wife stone";
            const prefix = "wasm";
            const accountNumbers = [0, 1, 2, 3, 4];
            const hdPaths = accountNumbers.map(paths_1.makeCosmoshubPath);
            const original = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic(mnemonic, {
                hdPaths: hdPaths,
                prefix: prefix,
            });
            const password = "123";
            const serialized = await original.serialize(password);
            const deserialized = await secp256k1hdwallet_1.Secp256k1HdWallet.deserialize(serialized, password);
            const accounts = await deserialized.getAccounts();
            expect(deserialized.mnemonic).toEqual(mnemonic);
            // These values are taken from the generate_addresses.js script in the scripts/wasmd directory
            expect(accounts).toEqual([
                {
                    algo: "secp256k1",
                    pubkey: encoding_1.fromBase64("A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ"),
                    address: "wasm1pkptre7fdkl6gfrzlesjjvhxhlc3r4gm32kke3",
                },
                {
                    algo: "secp256k1",
                    pubkey: encoding_1.fromBase64("AiDosfIbBi54XJ1QjCeApumcy/FjdtF+YhywPf3DKTx7"),
                    address: "wasm10dyr9899g6t0pelew4nvf4j5c3jcgv0r5d3a5l",
                },
                {
                    algo: "secp256k1",
                    pubkey: encoding_1.fromBase64("AzQg33JZqH7vSsm09esZY5bZvmzYwE/SY78cA0iLxpD7"),
                    address: "wasm1xy4yqngt0nlkdcenxymg8tenrghmek4n3u2lwa",
                },
                {
                    algo: "secp256k1",
                    pubkey: encoding_1.fromBase64("A3gOAlB6aiRTCPvWMQg2+ZbGYNsLd8qlvV28m8p2UhY2"),
                    address: "wasm142u9fgcjdlycfcez3lw8x6x5h7rfjlnfaallkd",
                },
                {
                    algo: "secp256k1",
                    pubkey: encoding_1.fromBase64("Aum2063ub/ErUnIUB36sK55LktGUStgcbSiaAnL1wadu"),
                    address: "wasm1hsm76p4ahyhl5yh3ve9ur49r5kemhp2r93f89d",
                },
            ]);
        });
    });
    describe("deserializeWithEncryptionKey", () => {
        it("can restore", async () => {
            const password = "123";
            let serialized;
            {
                const original = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic(defaultMnemonic);
                const anyKdfParams = {
                    algorithm: "argon2id",
                    params: {
                        outputLength: 32,
                        opsLimit: 4,
                        memLimitKib: 3 * 1024,
                    },
                };
                const encryptionKey = await wallet_1.executeKdf(password, anyKdfParams);
                serialized = await original.serializeWithEncryptionKey(encryptionKey, anyKdfParams);
            }
            {
                const kdfConfiguration = secp256k1hdwallet_1.extractKdfConfiguration(serialized);
                const encryptionKey = await wallet_1.executeKdf(password, kdfConfiguration);
                const deserialized = await secp256k1hdwallet_1.Secp256k1HdWallet.deserializeWithEncryptionKey(serialized, encryptionKey);
                expect(deserialized.mnemonic).toEqual(defaultMnemonic);
                expect(await deserialized.getAccounts()).toEqual([
                    {
                        algo: "secp256k1",
                        address: defaultAddress,
                        pubkey: defaultPubkey,
                    },
                ]);
            }
        });
        it("can restore multiple accounts", async () => {
            const mnemonic = "economy stock theory fatal elder harbor betray wasp final emotion task crumble siren bottom lizard educate guess current outdoor pair theory focus wife stone";
            const prefix = "wasm";
            const password = "123";
            const accountNumbers = [0, 1, 2, 3, 4];
            const hdPaths = accountNumbers.map(paths_1.makeCosmoshubPath);
            let serialized;
            {
                const original = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic(mnemonic, { prefix: prefix, hdPaths: hdPaths });
                const anyKdfParams = {
                    algorithm: "argon2id",
                    params: {
                        outputLength: 32,
                        opsLimit: 4,
                        memLimitKib: 3 * 1024,
                    },
                };
                const encryptionKey = await wallet_1.executeKdf(password, anyKdfParams);
                serialized = await original.serializeWithEncryptionKey(encryptionKey, anyKdfParams);
            }
            {
                const kdfConfiguration = secp256k1hdwallet_1.extractKdfConfiguration(serialized);
                const encryptionKey = await wallet_1.executeKdf(password, kdfConfiguration);
                const deserialized = await secp256k1hdwallet_1.Secp256k1HdWallet.deserializeWithEncryptionKey(serialized, encryptionKey);
                const accounts = await deserialized.getAccounts();
                expect(deserialized.mnemonic).toEqual(mnemonic);
                expect(deserialized.mnemonic).toEqual(mnemonic);
                // These values are taken from the generate_addresses.js script in the scripts/wasmd directory
                expect(accounts).toEqual([
                    {
                        algo: "secp256k1",
                        pubkey: encoding_1.fromBase64("A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ"),
                        address: "wasm1pkptre7fdkl6gfrzlesjjvhxhlc3r4gm32kke3",
                    },
                    {
                        algo: "secp256k1",
                        pubkey: encoding_1.fromBase64("AiDosfIbBi54XJ1QjCeApumcy/FjdtF+YhywPf3DKTx7"),
                        address: "wasm10dyr9899g6t0pelew4nvf4j5c3jcgv0r5d3a5l",
                    },
                    {
                        algo: "secp256k1",
                        pubkey: encoding_1.fromBase64("AzQg33JZqH7vSsm09esZY5bZvmzYwE/SY78cA0iLxpD7"),
                        address: "wasm1xy4yqngt0nlkdcenxymg8tenrghmek4n3u2lwa",
                    },
                    {
                        algo: "secp256k1",
                        pubkey: encoding_1.fromBase64("A3gOAlB6aiRTCPvWMQg2+ZbGYNsLd8qlvV28m8p2UhY2"),
                        address: "wasm142u9fgcjdlycfcez3lw8x6x5h7rfjlnfaallkd",
                    },
                    {
                        algo: "secp256k1",
                        pubkey: encoding_1.fromBase64("Aum2063ub/ErUnIUB36sK55LktGUStgcbSiaAnL1wadu"),
                        address: "wasm1hsm76p4ahyhl5yh3ve9ur49r5kemhp2r93f89d",
                    },
                ]);
            }
        });
    });
    describe("getAccounts", () => {
        it("resolves to a list of accounts", async () => {
            const wallet = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic(defaultMnemonic);
            const accounts = await wallet.getAccounts();
            expect(accounts.length).toEqual(1);
            expect(accounts[0]).toEqual({
                address: defaultAddress,
                algo: "secp256k1",
                pubkey: defaultPubkey,
            });
        });
        it("creates the same address as Go implementation", async () => {
            const wallet = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic("oyster design unusual machine spread century engine gravity focus cave carry slot");
            const [{ address }] = await wallet.getAccounts();
            expect(address).toEqual("cosmos1cjsxept9rkggzxztslae9ndgpdyt2408lk850u");
        });
    });
    describe("signAmino", () => {
        it("resolves to valid signature", async () => {
            const wallet = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic(defaultMnemonic);
            const signDoc = {
                msgs: [],
                fee: { amount: [], gas: "23" },
                chain_id: "foochain",
                memo: "hello, world",
                account_number: "7",
                sequence: "54",
            };
            const { signed, signature } = await wallet.signAmino(defaultAddress, signDoc);
            expect(signed).toEqual(signDoc);
            const valid = await crypto_1.Secp256k1.verifySignature(crypto_1.Secp256k1Signature.fromFixedLength(encoding_1.fromBase64(signature.signature)), crypto_1.sha256(signdoc_1.serializeSignDoc(signed)), defaultPubkey);
            expect(valid).toEqual(true);
        });
    });
    describe("serialize", () => {
        it("can save with password", async () => {
            const wallet = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic(defaultMnemonic);
            const serialized = await wallet.serialize("123");
            expect(JSON.parse(serialized)).toEqual({
                type: "secp256k1wallet-v1",
                kdf: {
                    algorithm: "argon2id",
                    params: {
                        outputLength: 32,
                        opsLimit: 24,
                        memLimitKib: 12 * 1024,
                    },
                },
                encryption: {
                    algorithm: "xchacha20poly1305-ietf",
                },
                data: jasmine.stringMatching(testutils_spec_1.base64Matcher),
            });
        });
    });
    describe("serializeWithEncryptionKey", () => {
        it("can save with password", async () => {
            const wallet = await secp256k1hdwallet_1.Secp256k1HdWallet.fromMnemonic(defaultMnemonic);
            const key = encoding_1.fromHex("aabb221100aabb332211aabb33221100aabb221100aabb332211aabb33221100");
            const customKdfConfiguration = {
                algorithm: "argon2id",
                params: {
                    outputLength: 32,
                    opsLimit: 321,
                    memLimitKib: 11 * 1024,
                },
            };
            const serialized = await wallet.serializeWithEncryptionKey(key, customKdfConfiguration);
            expect(JSON.parse(serialized)).toEqual({
                type: "secp256k1wallet-v1",
                kdf: customKdfConfiguration,
                encryption: {
                    algorithm: "xchacha20poly1305-ietf",
                },
                data: jasmine.stringMatching(testutils_spec_1.base64Matcher),
            });
        });
    });
});
//# sourceMappingURL=secp256k1hdwallet.spec.js.map