"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coins_1 = require("./coins");
describe("coins", () => {
    describe("coin", () => {
        it("works for number amounts", () => {
            expect(coins_1.coin(123, "utoken")).toEqual({ amount: "123", denom: "utoken" });
            expect(coins_1.coin(123.0, "utoken")).toEqual({ amount: "123", denom: "utoken" });
            expect(coins_1.coin(Number.MAX_SAFE_INTEGER, "utoken")).toEqual({
                amount: "9007199254740991",
                denom: "utoken",
            });
            expect(coins_1.coin(+0, "utoken")).toEqual({ amount: "0", denom: "utoken" });
            expect(coins_1.coin(-0, "utoken")).toEqual({ amount: "0", denom: "utoken" });
        });
        it("throws for non-safe-integer values", () => {
            expect(() => coins_1.coin(1.23, "utoken")).toThrowError(/Given amount is not a safe integer/i);
            expect(() => coins_1.coin(NaN, "utoken")).toThrowError(/Given amount is not a safe integer/i);
            expect(() => coins_1.coin(Number.POSITIVE_INFINITY, "utoken")).toThrowError(/Given amount is not a safe integer/i);
            expect(() => coins_1.coin(Number.MAX_SAFE_INTEGER + 1, "utoken")).toThrowError(/Given amount is not a safe integer/i);
        });
        it("throws for negative values", () => {
            expect(() => coins_1.coin(-1, "utoken")).toThrowError(/Given amount is not a safe integer/i);
            expect(() => coins_1.coin(Number.MIN_SAFE_INTEGER, "utoken")).toThrowError(/Given amount is not a safe integer/i);
            expect(() => coins_1.coin(Number.NEGATIVE_INFINITY, "utoken")).toThrowError(/Given amount is not a safe integer/i);
        });
        it("works for string amounts", () => {
            expect(coins_1.coin("0", "utoken")).toEqual({ amount: "0", denom: "utoken" });
            expect(coins_1.coin("1", "utoken")).toEqual({ amount: "1", denom: "utoken" });
            expect(coins_1.coin("00123", "utoken")).toEqual({ amount: "123", denom: "utoken" });
            expect(coins_1.coin("12300", "utoken")).toEqual({ amount: "12300", denom: "utoken" });
            expect(coins_1.coin("9007199254740992", "utoken")).toEqual({ amount: "9007199254740992", denom: "utoken" });
            // ETH supply (~118 mio ETH)
            expect(coins_1.coin("118273505060000000000000000", "wei")).toEqual({
                amount: "118273505060000000000000000",
                denom: "wei",
            });
        });
        it("throws for invalid amount strings", () => {
            expect(() => coins_1.coin("-1", "utoken")).toThrowError(/Invalid unsigned integer string format/i);
            expect(() => coins_1.coin("0x01", "utoken")).toThrowError(/Invalid unsigned integer string format/i);
            expect(() => coins_1.coin("NaN", "utoken")).toThrowError(/Invalid unsigned integer string format/i);
            expect(() => coins_1.coin("1.0", "utoken")).toThrowError(/Invalid unsigned integer string format/i);
            expect(() => coins_1.coin("1 ", "utoken")).toThrowError(/Invalid unsigned integer string format/i);
            expect(() => coins_1.coin(" 1", "utoken")).toThrowError(/Invalid unsigned integer string format/i);
            expect(() => coins_1.coin("1.1827350506e+26", "utoken")).toThrowError(/Invalid unsigned integer string format/i);
        });
    });
    describe("coins", () => {
        it("returns one element array of coin", () => {
            expect(coins_1.coins(123, "utoken")).toEqual([{ amount: "123", denom: "utoken" }]);
            expect(coins_1.coins("123", "utoken")).toEqual([{ amount: "123", denom: "utoken" }]);
        });
    });
    describe("parseCoins", () => {
        it("works for empty", () => {
            expect(coins_1.parseCoins("")).toEqual([]);
        });
        it("works for one element", () => {
            expect(coins_1.parseCoins("7643ureef")).toEqual([
                {
                    amount: "7643",
                    denom: "ureef",
                },
            ]);
        });
        it("works for two", () => {
            expect(coins_1.parseCoins("819966000ucosm,700000000ustake")).toEqual([
                {
                    amount: "819966000",
                    denom: "ucosm",
                },
                {
                    amount: "700000000",
                    denom: "ustake",
                },
            ]);
        });
        it("ignores empty elements", () => {
            // start
            expect(coins_1.parseCoins(",819966000ucosm,700000000ustake")).toEqual([
                {
                    amount: "819966000",
                    denom: "ucosm",
                },
                {
                    amount: "700000000",
                    denom: "ustake",
                },
            ]);
            // middle
            expect(coins_1.parseCoins("819966000ucosm,,700000000ustake")).toEqual([
                {
                    amount: "819966000",
                    denom: "ucosm",
                },
                {
                    amount: "700000000",
                    denom: "ustake",
                },
            ]);
            // end
            expect(coins_1.parseCoins("819966000ucosm,700000000ustake,")).toEqual([
                {
                    amount: "819966000",
                    denom: "ucosm",
                },
                {
                    amount: "700000000",
                    denom: "ustake",
                },
            ]);
        });
        it("throws for invalid inputs", () => {
            // denom missing
            expect(() => coins_1.parseCoins("3456")).toThrowError(/invalid coin string/i);
            // amount missing
            expect(() => coins_1.parseCoins("ucosm")).toThrowError(/invalid coin string/i);
        });
    });
});
//# sourceMappingURL=coins.spec.js.map