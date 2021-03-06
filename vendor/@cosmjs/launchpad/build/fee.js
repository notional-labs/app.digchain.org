"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFeeTable = exports.GasPrice = void 0;
const amino_1 = require("@cosmjs/amino");
const math_1 = require("@cosmjs/math");
/**
 * Denom checker for the Cosmos SDK 0.39 denom pattern
 * (https://github.com/cosmos/cosmos-sdk/blob/v0.39.3/types/coin.go#L597-L598).
 *
 * This is like a regexp but with helpful error messages.
 */
function checkDenom(denom) {
    if (denom.length < 3 || denom.length > 16) {
        throw new Error("Denom must be between 3 and 16 characters");
    }
    if (denom.match(/[^a-z0-9]/)) {
        throw new Error("Denom must only contain lower case letters a-z and digits 0-9");
    }
}
/**
 * A gas price, i.e. the price of a single unit of gas. This is typically a fraction of
 * the smallest fee token unit, such as 0.012utoken.
 */
class GasPrice {
    constructor(amount, denom) {
        this.amount = amount;
        this.denom = denom;
    }
    /**
     * Parses a gas price formatted as `<amount><denom>`, e.g. `GasPrice.fromString("0.012utoken")`.
     *
     * The denom must match the Cosmos SDK 0.39 pattern (https://github.com/cosmos/cosmos-sdk/blob/v0.39.3/types/coin.go#L597-L598).
     * See `GasPrice` in @cosmjs/stargate for a more generic matcher.
     */
    static fromString(gasPrice) {
        // Use Decimal.fromUserInput and checkDenom for detailed checks and helpful error messages
        const matchResult = gasPrice.match(/^([0-9.]+)([a-z][a-z0-9]*)$/i);
        if (!matchResult) {
            throw new Error("Invalid gas price string");
        }
        const [_, amount, denom] = matchResult;
        checkDenom(denom);
        const fractionalDigits = 18;
        const decimalAmount = math_1.Decimal.fromUserInput(amount, fractionalDigits);
        return new GasPrice(decimalAmount, denom);
    }
}
exports.GasPrice = GasPrice;
function calculateFee(gasLimit, { denom, amount: gasPriceAmount }) {
    const amount = Math.ceil(gasPriceAmount.multiply(new math_1.Uint53(gasLimit)).toFloatApproximation());
    return {
        amount: amino_1.coins(amount, denom),
        gas: gasLimit.toString(),
    };
}
function buildFeeTable(gasPrice, defaultGasLimits, gasLimits) {
    return Object.entries(defaultGasLimits).reduce((feeTable, [type, defaultGasLimit]) => (Object.assign(Object.assign({}, feeTable), { [type]: calculateFee(gasLimits[type] || defaultGasLimit, gasPrice) })), {});
}
exports.buildFeeTable = buildFeeTable;
//# sourceMappingURL=fee.js.map