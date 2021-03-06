"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
describe("utils", () => {
    describe("uint64ToNumber", () => {
        it("works for numeric inputs", () => {
            expect(utils_1.uint64ToNumber(0)).toEqual(0);
            expect(utils_1.uint64ToNumber(1)).toEqual(1);
            expect(utils_1.uint64ToNumber(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
        });
        it("works for string inputs", () => {
            expect(utils_1.uint64ToNumber("0")).toEqual(0);
            expect(utils_1.uint64ToNumber("1")).toEqual(1);
            expect(utils_1.uint64ToNumber("9007199254740991")).toEqual(Number.MAX_SAFE_INTEGER);
        });
        it("throws for invalid numbers", () => {
            expect(() => utils_1.uint64ToNumber(NaN)).toThrow();
            expect(() => utils_1.uint64ToNumber(1.1)).toThrow();
            expect(() => utils_1.uint64ToNumber(-1)).toThrow();
            expect(() => utils_1.uint64ToNumber(Number.MAX_SAFE_INTEGER + 1)).toThrow();
        });
        it("throws for invalid strings", () => {
            expect(() => utils_1.uint64ToNumber("")).toThrow();
            expect(() => utils_1.uint64ToNumber("0x22")).toThrow();
            expect(() => utils_1.uint64ToNumber("-1")).toThrow();
            expect(() => utils_1.uint64ToNumber("1.1")).toThrow();
            expect(() => utils_1.uint64ToNumber("9007199254740992")).toThrow();
        });
    });
    describe("uint64ToString", () => {
        it("works for numeric inputs", () => {
            expect(utils_1.uint64ToString(0)).toEqual("0");
            expect(utils_1.uint64ToString(1)).toEqual("1");
            expect(utils_1.uint64ToString(Number.MAX_SAFE_INTEGER)).toEqual("9007199254740991");
        });
        it("works for string inputs", () => {
            expect(utils_1.uint64ToString("0")).toEqual("0");
            expect(utils_1.uint64ToString("1")).toEqual("1");
            expect(utils_1.uint64ToString("9007199254740991")).toEqual("9007199254740991");
        });
        it("works for large string values", () => {
            // for the string -> string version, the full uint64 range is supported
            expect(utils_1.uint64ToString("9007199254740992")).toEqual("9007199254740992");
            expect(utils_1.uint64ToString("18446744073709551615")).toEqual("18446744073709551615");
        });
        it("throws for invalid numbers", () => {
            expect(() => utils_1.uint64ToString(NaN)).toThrow();
            expect(() => utils_1.uint64ToString(1.1)).toThrow();
            expect(() => utils_1.uint64ToString(-1)).toThrow();
            expect(() => utils_1.uint64ToString(Number.MAX_SAFE_INTEGER + 1)).toThrow();
        });
        it("throws for invalid strings", () => {
            expect(() => utils_1.uint64ToString("")).toThrow();
            expect(() => utils_1.uint64ToString("0x22")).toThrow();
            expect(() => utils_1.uint64ToString("-1")).toThrow();
            expect(() => utils_1.uint64ToString("1.1")).toThrow();
            expect(() => utils_1.uint64ToString("18446744073709551616")).toThrow();
        });
    });
    describe("normalizePubkey", () => {
        it("interprets empty bech32 string as unset", () => {
            expect(utils_1.normalizePubkey("")).toBeNull();
        });
        it("decodes bech32 pubkey", () => {
            const input = "cosmospub1addwnpepqd8sgxq7aw348ydctp3n5ajufgxp395hksxjzc6565yfp56scupfqhlgyg5";
            expect(utils_1.normalizePubkey(input)).toEqual({
                type: "tendermint/PubKeySecp256k1",
                value: "A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
            });
        });
        it("interprets null as unset", () => {
            expect(utils_1.normalizePubkey(null)).toBeNull();
        });
        it("passes PubKey unchanged", () => {
            const original = {
                type: "tendermint/PubKeySecp256k1",
                value: "A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
            };
            expect(utils_1.normalizePubkey(original)).toEqual(original);
        });
    });
});
//# sourceMappingURL=utils.spec.js.map