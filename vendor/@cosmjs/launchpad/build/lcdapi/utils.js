"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePubkey = exports.uint64ToString = exports.uint64ToNumber = void 0;
const amino_1 = require("@cosmjs/amino");
const math_1 = require("@cosmjs/math");
/**
 * Converts an integer expressed as number or string to a number.
 * Throws if input is not a valid uint64 or if the value exceeds MAX_SAFE_INTEGER.
 *
 * This is needed for supporting Comsos SDK 0.37/0.38/0.39 with one client.
 */
function uint64ToNumber(input) {
    const value = typeof input === "number" ? math_1.Uint64.fromNumber(input) : math_1.Uint64.fromString(input);
    return value.toNumber();
}
exports.uint64ToNumber = uint64ToNumber;
/**
 * Converts an integer expressed as number or string to a string.
 * Throws if input is not a valid uint64.
 *
 * This is needed for supporting Comsos SDK 0.37/0.38/0.39 with one client.
 */
function uint64ToString(input) {
    const value = typeof input === "number" ? math_1.Uint64.fromNumber(input) : math_1.Uint64.fromString(input);
    return value.toString();
}
exports.uint64ToString = uint64ToString;
/**
 * Normalizes a pubkey as in `BaseAccount.public_key` to allow supporting
 * Comsos SDK 0.37–0.39.
 *
 * Returns null when unset.
 */
function normalizePubkey(input) {
    if (!input)
        return null;
    if (typeof input === "string")
        return amino_1.decodeBech32Pubkey(input);
    return input;
}
exports.normalizePubkey = normalizePubkey;
//# sourceMappingURL=utils.js.map