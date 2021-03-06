"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testutils_spec_1 = require("../testutils.spec");
const bank_1 = require("./bank");
const lcdclient_1 = require("./lcdclient");
function makeBankClient(apiUrl) {
    return lcdclient_1.LcdClient.withExtensions({ apiUrl }, bank_1.setupBankExtension);
}
describe("BankExtension", () => {
    it("returns correct values for the unused account", async () => {
        testutils_spec_1.pendingWithoutLaunchpad();
        const client = makeBankClient(testutils_spec_1.launchpad.endpoint);
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
    it("returns an empty result for a non-existent account", async () => {
        testutils_spec_1.pendingWithoutLaunchpad();
        const client = makeBankClient(testutils_spec_1.launchpad.endpoint);
        const nonExistentAddress = testutils_spec_1.makeRandomAddress();
        const balances = await client.bank.balances(nonExistentAddress);
        expect(balances).toEqual({
            height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
            result: [],
        });
    });
});
//# sourceMappingURL=bank.spec.js.map