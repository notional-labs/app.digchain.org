"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const amino_1 = require("@cosmjs/amino");
const encoding_1 = require("@cosmjs/encoding");
const utils_1 = require("@cosmjs/utils");
const cosmosclient_1 = require("../cosmosclient");
const signingcosmosclient_1 = require("../signingcosmosclient");
const testutils_spec_1 = require("../testutils.spec");
const tx_1 = require("../tx");
const distribution_1 = require("./distribution");
const lcdclient_1 = require("./lcdclient");
function makeDistributionClient(apiUrl) {
    return lcdclient_1.LcdClient.withExtensions({ apiUrl }, distribution_1.setupDistributionExtension);
}
describe("DistributionExtension", () => {
    const defaultFee = {
        amount: amino_1.coins(25000, "ucosm"),
        gas: "1500000", // 1.5 million
    };
    beforeAll(async () => {
        if (testutils_spec_1.launchpadEnabled()) {
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet);
            const chainId = await client.getChainId();
            const msg = {
                type: "cosmos-sdk/MsgDelegate",
                value: {
                    delegator_address: testutils_spec_1.faucet.address0,
                    validator_address: testutils_spec_1.launchpad.validator.address,
                    amount: amino_1.coin(25000, "ustake"),
                },
            };
            const memo = "Test delegation for launchpad";
            const { accountNumber, sequence } = await client.getSequence();
            const signDoc = amino_1.makeSignDoc([msg], defaultFee, chainId, memo, accountNumber, sequence);
            const { signed, signature } = await wallet.signAmino(testutils_spec_1.faucet.address0, signDoc);
            const signedTx = tx_1.makeStdTx(signed, signature);
            const result = await client.broadcastTx(signedTx);
            cosmosclient_1.assertIsBroadcastTxSuccess(result);
            await utils_1.sleep(75); // wait until transactions are indexed
        }
    });
    describe("delegatorRewards", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeDistributionClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.distribution.delegatorRewards(testutils_spec_1.faucet.address0);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    rewards: [
                        {
                            validator_address: testutils_spec_1.launchpad.validator.address,
                            reward: null,
                        },
                    ],
                    total: null,
                },
            });
        });
    });
    describe("delegatorReward", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeDistributionClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.distribution.delegatorReward(testutils_spec_1.faucet.address0, testutils_spec_1.launchpad.validator.address);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [],
            });
        });
    });
    describe("withdrawAddress", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeDistributionClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.distribution.withdrawAddress(testutils_spec_1.faucet.address0);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: testutils_spec_1.faucet.address0,
            });
        });
    });
    describe("validator", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeDistributionClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.distribution.validator(testutils_spec_1.launchpad.validator.address);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    // TODO: This smells like a bug in the backend to me
                    operatorAddress: encoding_1.Bech32.encode("cosmos", encoding_1.Bech32.decode(testutils_spec_1.launchpad.validator.address).data),
                    self_bond_rewards: [
                        { denom: "ucosm", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                        { denom: "ustake", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                    ],
                    val_commission: [
                        { denom: "ucosm", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                        { denom: "ustake", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                    ],
                },
            });
        });
    });
    describe("validatorRewards", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeDistributionClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.distribution.validatorRewards(testutils_spec_1.launchpad.validator.address);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    { denom: "ucosm", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                    { denom: "ustake", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                ],
            });
        });
    });
    describe("validatorOutstandingRewards", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeDistributionClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.distribution.validatorOutstandingRewards(testutils_spec_1.launchpad.validator.address);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    { denom: "ucosm", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                    { denom: "ustake", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                ],
            });
        });
    });
    describe("parameters", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeDistributionClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.distribution.parameters();
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    community_tax: "0.020000000000000000",
                    base_proposer_reward: "0.010000000000000000",
                    bonus_proposer_reward: "0.040000000000000000",
                    withdraw_addr_enabled: true,
                },
            });
        });
    });
    describe("communityPool", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeDistributionClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.distribution.communityPool();
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    { denom: "ucosm", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                    { denom: "ustake", amount: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher) },
                ],
            });
        });
    });
});
//# sourceMappingURL=distribution.spec.js.map