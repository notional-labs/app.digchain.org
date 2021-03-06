"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const testutils_spec_1 = require("../testutils.spec");
const lcdclient_1 = require("./lcdclient");
const mint_1 = require("./mint");
function makeMintClient(apiUrl) {
    return lcdclient_1.LcdClient.withExtensions({ apiUrl }, mint_1.setupMintExtension);
}
describe("MintExtension", () => {
    describe("parameters", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeMintClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.mint.parameters();
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    mint_denom: "ustake",
                    inflation_rate_change: "0.130000000000000000",
                    inflation_max: "0.200000000000000000",
                    inflation_min: "0.070000000000000000",
                    goal_bonded: "0.670000000000000000",
                    blocks_per_year: "6311520",
                },
            });
        });
    });
    describe("inflation", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeMintClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.mint.inflation();
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: jasmine.stringMatching(testutils_spec_1.smallDecimalMatcher),
            });
        });
    });
    describe("annualProvisions", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeMintClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.mint.annualProvisions();
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: jasmine.stringMatching(testutils_spec_1.bigDecimalMatcher),
            });
        });
    });
});
//# sourceMappingURL=mint.spec.js.map