"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const encoding_1 = require("@cosmjs/encoding");
const encoding_2 = require("./encoding");
const testutils_spec_1 = require("./testutils.spec");
describe("encoding", () => {
    describe("encodeSecp256k1Pubkey", () => {
        it("encodes a compressed pubkey", () => {
            const pubkey = encoding_1.fromBase64("AtQaCqFnshaZQp6rIkvAPyzThvCvXSDO+9AzbxVErqJP");
            expect(encoding_2.encodeSecp256k1Pubkey(pubkey)).toEqual({
                type: "tendermint/PubKeySecp256k1",
                value: "AtQaCqFnshaZQp6rIkvAPyzThvCvXSDO+9AzbxVErqJP",
            });
        });
        it("throws for uncompressed public keys", () => {
            const pubkey = encoding_1.fromBase64("BE8EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQE7WHpoHoNswYeoFkuYpYSKK4mzFzMV/dB0DVAy4lnNU=");
            expect(() => encoding_2.encodeSecp256k1Pubkey(pubkey)).toThrowError(/public key must be compressed secp256k1/i);
        });
    });
    describe("decodeAminoPubkey", () => {
        it("works for secp256k1", () => {
            const amino = encoding_1.Bech32.decode("cosmospub1addwnpepqd8sgxq7aw348ydctp3n5ajufgxp395hksxjzc6565yfp56scupfqhlgyg5").data;
            expect(encoding_2.decodeAminoPubkey(amino)).toEqual({
                type: "tendermint/PubKeySecp256k1",
                value: "A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
            });
        });
        it("works for ed25519", () => {
            // Encoded from `corald tendermint show-validator`
            // Decoded from http://localhost:26657/validators
            const amino = encoding_1.Bech32.decode("coralvalconspub1zcjduepqvxg72ccnl9r65fv0wn3amlk4sfzqfe2k36l073kjx2qyaf6sk23qw7j8wq").data;
            expect(encoding_2.decodeAminoPubkey(amino)).toEqual({
                type: "tendermint/PubKeyEd25519",
                value: "YZHlYxP5R6olj3Tj3f7VgkQE5VaOvv9G0jKATqdQsqI=",
            });
        });
        it("works for sr25519", () => {
            pending("No test data available");
        });
        it("works for multisig", () => {
            const pubkeyData = encoding_1.Bech32.decode("cosmospub1addwnpepqd8sgxq7aw348ydctp3n5ajufgxp395hksxjzc6565yfp56scupfqhlgyg5").data;
            const pubkey = {
                type: "tendermint/PubKeySecp256k1",
                value: "A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
            };
            const data1 = encoding_1.fromHex("22C1F7E20805");
            expect(encoding_2.decodeAminoPubkey(data1)).toEqual({
                type: "tendermint/PubKeyMultisigThreshold",
                value: {
                    threshold: "5",
                    pubkeys: [],
                },
            });
            const data2 = Uint8Array.from([...encoding_1.fromHex("22C1F7E2081a"), 0x12, pubkeyData.length, ...pubkeyData]);
            expect(encoding_2.decodeAminoPubkey(data2)).toEqual({
                type: "tendermint/PubKeyMultisigThreshold",
                value: {
                    threshold: "26",
                    pubkeys: [pubkey],
                },
            });
            const data3 = Uint8Array.from([
                ...encoding_1.fromHex("22C1F7E2081a"),
                0x12,
                pubkeyData.length,
                ...pubkeyData,
                0x12,
                pubkeyData.length,
                ...pubkeyData,
            ]);
            expect(encoding_2.decodeAminoPubkey(data3)).toEqual({
                type: "tendermint/PubKeyMultisigThreshold",
                value: {
                    threshold: "26",
                    pubkeys: [pubkey, pubkey],
                },
            });
            expect(() => encoding_2.decodeAminoPubkey(encoding_1.fromHex("22C1F7E20705"))).toThrowError(/expecting 0x08 prefix/i);
        });
    });
    describe("decodeBech32Pubkey", () => {
        it("works", () => {
            expect(encoding_2.decodeBech32Pubkey("cosmospub1addwnpepqd8sgxq7aw348ydctp3n5ajufgxp395hksxjzc6565yfp56scupfqhlgyg5")).toEqual({
                type: "tendermint/PubKeySecp256k1",
                value: "A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
            });
        });
        it("works for enigma pubkey", () => {
            expect(encoding_2.decodeBech32Pubkey("enigmapub1addwnpepqw5k9p439nw0zpg2aundx4umwx4nw233z5prpjqjv5anl5grmnchzp2xwvv")).toEqual({
                type: "tendermint/PubKeySecp256k1",
                value: "A6lihrEs3PEFCu8m01ebcas3KjEVAjDIEmU7P9ED3PFx",
            });
        });
        it("works for ed25519", () => {
            // Encoded from `corald tendermint show-validator`
            // Decoded from http://localhost:26657/validators
            const decoded = encoding_2.decodeBech32Pubkey("coralvalconspub1zcjduepqvxg72ccnl9r65fv0wn3amlk4sfzqfe2k36l073kjx2qyaf6sk23qw7j8wq");
            expect(decoded).toEqual({
                type: "tendermint/PubKeyEd25519",
                value: "YZHlYxP5R6olj3Tj3f7VgkQE5VaOvv9G0jKATqdQsqI=",
            });
        });
        it("works for multisig", () => {
            expect(encoding_2.decodeBech32Pubkey(testutils_spec_1.testgroup1PubkeyBech32)).toEqual(testutils_spec_1.testgroup1);
            expect(encoding_2.decodeBech32Pubkey(testutils_spec_1.testgroup2PubkeyBech32)).toEqual(testutils_spec_1.testgroup2);
            expect(encoding_2.decodeBech32Pubkey(testutils_spec_1.testgroup3PubkeyBech32)).toEqual(testutils_spec_1.testgroup3);
        });
    });
    describe("encodeAminoPubkey", () => {
        it("works for secp256k1", () => {
            const pubkey = {
                type: "tendermint/PubKeySecp256k1",
                value: "A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
            };
            const expected = encoding_1.Bech32.decode("cosmospub1addwnpepqd8sgxq7aw348ydctp3n5ajufgxp395hksxjzc6565yfp56scupfqhlgyg5").data;
            expect(encoding_2.encodeAminoPubkey(pubkey)).toEqual(expected);
        });
        it("works for ed25519", () => {
            // Decoded from http://localhost:26657/validators
            // Encoded from `corald tendermint show-validator`
            const pubkey = {
                type: "tendermint/PubKeyEd25519",
                value: "YZHlYxP5R6olj3Tj3f7VgkQE5VaOvv9G0jKATqdQsqI=",
            };
            const expected = encoding_1.Bech32.decode("coralvalconspub1zcjduepqvxg72ccnl9r65fv0wn3amlk4sfzqfe2k36l073kjx2qyaf6sk23qw7j8wq").data;
            expect(encoding_2.encodeAminoPubkey(pubkey)).toEqual(expected);
        });
    });
    describe("encodeBech32Pubkey", () => {
        it("works for secp256k1", () => {
            const pubkey = {
                type: "tendermint/PubKeySecp256k1",
                value: "A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
            };
            expect(encoding_2.encodeBech32Pubkey(pubkey, "cosmospub")).toEqual("cosmospub1addwnpepqd8sgxq7aw348ydctp3n5ajufgxp395hksxjzc6565yfp56scupfqhlgyg5");
        });
        it("works for ed25519", () => {
            // Decoded from http://localhost:26657/validators
            // Encoded from `corald tendermint show-validator`
            const pubkey = {
                type: "tendermint/PubKeyEd25519",
                value: "YZHlYxP5R6olj3Tj3f7VgkQE5VaOvv9G0jKATqdQsqI=",
            };
            expect(encoding_2.encodeBech32Pubkey(pubkey, "coralvalconspub")).toEqual("coralvalconspub1zcjduepqvxg72ccnl9r65fv0wn3amlk4sfzqfe2k36l073kjx2qyaf6sk23qw7j8wq");
        });
        it("works for multisig", () => {
            const expected1 = encoding_1.Bech32.decode(testutils_spec_1.testgroup1PubkeyBech32).data;
            expect(encoding_2.encodeAminoPubkey(testutils_spec_1.testgroup1)).toEqual(expected1);
            const expected2 = encoding_1.Bech32.decode(testutils_spec_1.testgroup2PubkeyBech32).data;
            expect(encoding_2.encodeAminoPubkey(testutils_spec_1.testgroup2)).toEqual(expected2);
            const expected3 = encoding_1.Bech32.decode(testutils_spec_1.testgroup3PubkeyBech32).data;
            expect(encoding_2.encodeAminoPubkey(testutils_spec_1.testgroup3)).toEqual(expected3);
            const expected4 = encoding_1.Bech32.decode(testutils_spec_1.testgroup4PubkeyBech32).data;
            expect(encoding_2.encodeAminoPubkey(testutils_spec_1.testgroup4)).toEqual(expected4);
        });
    });
});
//# sourceMappingURL=encoding.spec.js.map