"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const amino_1 = require("@cosmjs/amino");
const utils_1 = require("@cosmjs/utils");
const cosmosclient_1 = require("../cosmosclient");
const signingcosmosclient_1 = require("../signingcosmosclient");
const testutils_spec_1 = require("../testutils.spec");
const gov_1 = require("./gov");
const lcdclient_1 = require("./lcdclient");
function makeGovClient(apiUrl) {
    return lcdclient_1.LcdClient.withExtensions({ apiUrl }, gov_1.setupGovExtension);
}
describe("GovExtension", () => {
    const defaultFee = {
        amount: amino_1.coins(25000, "ucosm"),
        gas: "1500000", // 1.5 million
    };
    let proposalId;
    beforeAll(async () => {
        if (testutils_spec_1.launchpadEnabled()) {
            const wallet = await amino_1.Secp256k1HdWallet.fromMnemonic(testutils_spec_1.faucet.mnemonic);
            const client = new signingcosmosclient_1.SigningCosmosClient(testutils_spec_1.launchpad.endpoint, testutils_spec_1.faucet.address0, wallet);
            const chainId = await client.getChainId();
            const proposalMsg = {
                type: "cosmos-sdk/MsgSubmitProposal",
                value: {
                    content: {
                        type: "cosmos-sdk/TextProposal",
                        value: {
                            description: "This proposal proposes to test whether this proposal passes",
                            title: "Test Proposal",
                        },
                    },
                    proposer: testutils_spec_1.faucet.address0,
                    initial_deposit: amino_1.coins(25000000, "ustake"),
                },
            };
            const proposalMemo = "Test proposal for wasmd";
            const { accountNumber: proposalAccountNumber, sequence: proposalSequence } = await client.getSequence();
            const proposalSignDoc = amino_1.makeSignDoc([proposalMsg], defaultFee, chainId, proposalMemo, proposalAccountNumber, proposalSequence);
            const { signature: proposalSignature } = await wallet.signAmino(testutils_spec_1.faucet.address0, proposalSignDoc);
            const proposalTx = {
                msg: [proposalMsg],
                fee: defaultFee,
                memo: proposalMemo,
                signatures: [proposalSignature],
            };
            const proposalResult = await client.broadcastTx(proposalTx);
            cosmosclient_1.assertIsBroadcastTxSuccess(proposalResult);
            proposalId = proposalResult.logs[0].events
                .find(({ type }) => type === "submit_proposal")
                .attributes.find(({ key }) => key === "proposal_id").value;
            const voteMsg = {
                type: "cosmos-sdk/MsgVote",
                value: {
                    proposal_id: proposalId,
                    voter: testutils_spec_1.faucet.address0,
                    option: "Yes",
                },
            };
            const voteMemo = "Test vote for wasmd";
            const { accountNumber: voteAccountNumber, sequence: voteSequence } = await client.getSequence();
            const voteSignDoc = amino_1.makeSignDoc([voteMsg], defaultFee, chainId, voteMemo, voteAccountNumber, voteSequence);
            const { signature: voteSignature } = await wallet.signAmino(testutils_spec_1.faucet.address0, voteSignDoc);
            const voteTx = {
                msg: [voteMsg],
                fee: defaultFee,
                memo: voteMemo,
                signatures: [voteSignature],
            };
            await client.broadcastTx(voteTx);
            await utils_1.sleep(75); // wait until transactions are indexed
        }
    });
    describe("parameters", () => {
        it("works for deposit", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeGovClient(testutils_spec_1.launchpad.endpoint);
            const paramsType = gov_1.GovParametersType.Deposit;
            const response = await client.gov.parameters(paramsType);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    min_deposit: [{ denom: "ustake", amount: "10000000" }],
                    max_deposit_period: "172800000000000",
                },
            });
        });
        it("works for tallying", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeGovClient(testutils_spec_1.launchpad.endpoint);
            const paramsType = gov_1.GovParametersType.Tallying;
            const response = await client.gov.parameters(paramsType);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    quorum: "0.334000000000000000",
                    threshold: "0.500000000000000000",
                    veto: "0.334000000000000000",
                },
            });
        });
        it("works for voting", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeGovClient(testutils_spec_1.launchpad.endpoint);
            const paramsType = gov_1.GovParametersType.Voting;
            const response = await client.gov.parameters(paramsType);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    voting_period: "172800000000000",
                },
            });
        });
    });
    describe("proposals", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeGovClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.gov.proposals();
            expect(response.height).toMatch(testutils_spec_1.nonNegativeIntegerMatcher);
            expect(response.result.length).toBeGreaterThanOrEqual(1);
            expect(response.result[response.result.length - 1]).toEqual({
                content: {
                    type: "cosmos-sdk/TextProposal",
                    value: {
                        title: "Test Proposal",
                        description: "This proposal proposes to test whether this proposal passes",
                    },
                },
                id: proposalId,
                proposal_status: "VotingPeriod",
                final_tally_result: { yes: "0", abstain: "0", no: "0", no_with_veto: "0" },
                submit_time: jasmine.stringMatching(testutils_spec_1.dateTimeStampMatcher),
                deposit_end_time: jasmine.stringMatching(testutils_spec_1.dateTimeStampMatcher),
                total_deposit: [{ denom: "ustake", amount: "25000000" }],
                voting_start_time: jasmine.stringMatching(testutils_spec_1.dateTimeStampMatcher),
                voting_end_time: jasmine.stringMatching(testutils_spec_1.dateTimeStampMatcher),
            });
        });
    });
    describe("proposal", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeGovClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.gov.proposal(proposalId);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    content: {
                        type: "cosmos-sdk/TextProposal",
                        value: {
                            title: "Test Proposal",
                            description: "This proposal proposes to test whether this proposal passes",
                        },
                    },
                    id: proposalId,
                    proposal_status: "VotingPeriod",
                    final_tally_result: { yes: "0", abstain: "0", no: "0", no_with_veto: "0" },
                    submit_time: jasmine.stringMatching(testutils_spec_1.dateTimeStampMatcher),
                    deposit_end_time: jasmine.stringMatching(testutils_spec_1.dateTimeStampMatcher),
                    total_deposit: [{ denom: "ustake", amount: "25000000" }],
                    voting_start_time: jasmine.stringMatching(testutils_spec_1.dateTimeStampMatcher),
                    voting_end_time: jasmine.stringMatching(testutils_spec_1.dateTimeStampMatcher),
                },
            });
        });
    });
    describe("proposer", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeGovClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.gov.proposer(proposalId);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    proposal_id: proposalId,
                    proposer: testutils_spec_1.faucet.address0,
                },
            });
        });
    });
    describe("deposits", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeGovClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.gov.deposits(proposalId);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    {
                        proposal_id: proposalId,
                        depositor: testutils_spec_1.faucet.address0,
                        amount: [{ denom: "ustake", amount: "25000000" }],
                    },
                ],
            });
        });
    });
    describe("deposit", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeGovClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.gov.deposit(proposalId, testutils_spec_1.faucet.address0);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    proposal_id: proposalId,
                    depositor: testutils_spec_1.faucet.address0,
                    amount: [{ denom: "ustake", amount: "25000000" }],
                },
            });
        });
    });
    describe("tally", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeGovClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.gov.tally(proposalId);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    yes: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                    abstain: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                    no: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                    no_with_veto: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                },
            });
        });
    });
    describe("votes", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeGovClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.gov.votes(proposalId);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: [
                    {
                        proposal_id: proposalId,
                        voter: testutils_spec_1.faucet.address0,
                        option: "Yes",
                    },
                ],
            });
        });
    });
    describe("vote", () => {
        it("works", async () => {
            testutils_spec_1.pendingWithoutLaunchpad();
            const client = makeGovClient(testutils_spec_1.launchpad.endpoint);
            const response = await client.gov.vote(proposalId, testutils_spec_1.faucet.address0);
            expect(response).toEqual({
                height: jasmine.stringMatching(testutils_spec_1.nonNegativeIntegerMatcher),
                result: {
                    voter: testutils_spec_1.faucet.address0,
                    proposal_id: proposalId,
                    option: "Yes",
                },
            });
        });
    });
});
//# sourceMappingURL=gov.spec.js.map