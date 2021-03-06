"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const testutils_spec_1 = require("../testutils.spec");
const lcdclient_1 = require("./lcdclient");
const slashing_1 = require("./slashing");
function makeSlashingClient(apiUrl) {
    return lcdclient_1.LcdClient.withExtensions({ apiUrl }, slashing_1.setupSlashingExtension);
}
describe("SlashingExtension", () => {
    describe("signingInfos", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeSlashingClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.slashing.signingInfos();
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    {
                        address: "cosmosvalcons1m74e42saykuj34ugc7weqq4kc97fn5ecqpdl2q",
                        start_height: "0",
                        index_offset: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                        jailed_until: "1970-01-01T00:00:00Z",
                        tombstoned: false,
                        missed_blocks_counter: "0",
                    },
                ],
            });
        });
    });
    describe("parameters", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeSlashingClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.slashing.parameters();
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    signed_blocks_window: "100",
                    min_signed_per_window: "0.500000000000000000",
                    downtime_jail_duration: "600000000000",
                    slash_fraction_double_sign: "0.050000000000000000",
                    slash_fraction_downtime: "0.010000000000000000",
                },
            });
        });
    });
});
//# sourceMappingURL=slashing.spec.js.map