"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testutils_spec_1 = require("../testutils.spec");
const lcdclient_1 = require("./lcdclient");
const supply_1 = require("./supply");
describe("SupplyExtension", () => {
    describe("totalAll", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint }, supply_1.setupSupplyExtension);
            const supply = await client.supply.totalAll();
            expect(supply).toEqual({
                height: jasmine.stringMatching(/^[0-9]+$/),
                result: [
                    {
                        amount: jasmine.stringMatching(/^[0-9]+$/),
                        denom: "ucosm",
                    },
                    {
                        amount: jasmine.stringMatching(/^[0-9]+$/),
                        denom: "ustake",
                    },
                ],
            });
        });
    });
    describe("total", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = lcdclient_1.LcdClient.withExtensions({ apiUrl: testutils_spec_1.launchpad.endpoint }, supply_1.setupSupplyExtension);
            const supply = await client.supply.total("ucosm");
            expect(supply).toEqual({
                height: jasmine.stringMatching(/^[0-9]+$/),
                result: jasmine.stringMatching(/^[0-9]+$/),
            });
        });
    });
});
//# sourceMappingURL=supply.spec.js.map