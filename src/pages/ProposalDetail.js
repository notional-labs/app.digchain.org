import { useState, useEffect } from "react";
import {
    useParams
} from "react-router-dom";
import { getProposal, getProposer } from "../helpers/getProposal";
import '../assets/css/ProposalDetail.css'

const style = {
    card: {
        backgroundColor: 'rgb(255, 255, 255)',
        padding: '2em',
        borderRadius: '20px',
        minHeight: '100%',
        fontFamily: 'Lato',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    title: {
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: '1.3rem',
    },
    content: {
        textAlign: 'left',
    },

}

const ProposalDetail = () => {
    const [proposal, setProposal] = useState([])
    const [proposer, setProposer] = useState({
        proposal_id: -1,
        proposer: ''
    })
    let { id } = useParams();

    useEffect(() => {
        (async () => {
            const res = await getProposal(id)
            const proposalById = res.result
            const proposer = await getProposer(id)
            setProposer({ ...proposer.result })
            setProposal([proposalById])
        })()
    }, [id])

    const getStatus = () => {
        if (proposal[0].status === 3) {
            return (
                <span style={{
                    color: '#28c76f',
                    backgroundColor: 'rgba(40,199,111,.12)',
                    fontWeight: 'bold',
                    padding: '0.5em',
                    borderRadius: '100px',
                    marginRight: '0.5em',
                    marginLeft: '0.5em'
                }}>
                    Passed
                </span>)
        }
        else if (proposal[0].status === 4) {
            return (
                <span style={{
                    color: '#ea5455',
                    backgroundColor: 'rgba(234,84,85,.12)',
                    fontWeight: 'bold',
                    padding: '0.5em',
                    borderRadius: '100px',
                    marginRight: '0.5em',
                    marginLeft: '0.5em'
                }}>
                    Rejected
                </span>
            )
        }
        else if (proposal[0].status === 1) {
            return (
                <span style={{
                    color: '#00cfe8',
                    backgroundColor: 'rgba(0,207,232,.12)',
                    fontWeight: 'bold',
                    padding: '0.5em',
                    borderRadius: '100px',
                    marginRight: '0.5em',
                    marginLeft: '0.5em'
                }}>
                    Deposit
                </span>
            )
        }
        else {
            return (
                <span style={{
                    color: '#7367f0',
                    backgroundColor: 'rgba(115,103,240,.12)',
                    fontWeight: 'bold',
                    padding: '0.5em',
                    borderRadius: '100px',
                    marginRight: '0.5em',
                    marginLeft: '0.5em'
                }}>
                    Voting
                </span>
            )
        }
    }
    return (
        <div>
            <div style={{
                fontSize: '3rem',
                color: '#EFCF20',
                fontFamily: 'Ubuntu',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                marginBottom: '0.5em'
            }}>
                Proposal Details
            </div>
            <div style={style.card}>
                <div style={style.title}>
                    <p className='title' style={style.title}>
                        #{proposal.length > 0 && proposal[0].id}
                        {proposal.length > 0 && getStatus()}
                        {proposal.length > 0 && proposal[0].content.value.title}
                    </p>
                </div>
                <div style={style.content}>
                    <div className="row">
                        <p>
                            Proposal ID
                        </p>
                        <p>
                            {proposal.length > 0 && proposal[0].id || 0}
                        </p>
                    </div>
                    <div className="row">
                        <p>
                            Proposer
                        </p>
                        <p>
                            {proposer.proposer}
                        </p>
                    </div>
                    <div className="row">
                        <p>
                            Total Deposit
                        </p>
                        <p>
                            {proposal.length > 0 &&
                                proposal[0].total_deposit.length > 0 &&
                                parseInt(proposal[0].total_deposit[0].amount) / 1000000}
                        </p>
                    </div>
                    <div className="row">
                        <p>
                            Submited Time
                        </p>
                        <p>
                            {proposal.length > 0 &&
                                `${proposal[0].submit_time.split('T')[0]} ${proposal[0].submit_time.split('T')[1]}`}
                        </p>
                    </div>
                    <div className="row">
                        <p>
                            Voting Time
                        </p>
                        <p>
                            {proposal.length > 0 &&
                                `${proposal[0].voting_start_time.split('T')[0]} ${proposal[0].voting_start_time.split('T')[1]}-${proposal[0].voting_end_time.split('T')[0]} ${proposal[0].voting_end_time.split('T')[1]}`}
                        </p>
                    </div>
                    <div className="row">
                        <p>
                            Proposal Type
                        </p>
                        <p>
                            {proposal.length > 0 && proposal[0].content.type}
                        </p>
                    </div>
                    <div className="row">
                        <p>
                            Title
                        </p>
                        <p>
                            {proposal.length > 0 && proposal[0].content.value.title}
                        </p>
                    </div>
                    <div className="row">
                        <p>
                            Description
                        </p>
                        <p>
                            {proposal.length > 0 && proposal[0].content.value.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProposalDetail