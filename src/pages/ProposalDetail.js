import { useState, useEffect, useCallback } from "react";
import {
    useParams,
    Link
} from "react-router-dom";
import { getProposal, getProposer, getTally } from "../helpers/getProposal";
import '../assets/css/ProposalDetail.css'
import VoterList from "../components/VoterList";
import { Modal } from "react-bootstrap";
import VoteModal from "../components/VoteModal";
import { RiBarChart2Fill } from "react-icons/ri";

const style = {
    card: {
        backgroundColor: '#EEC13F',
        padding: '40px',
        borderRadius: '20px',
        minHeight: '100%',
        fontFamily: 'Roboto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: '2em'
    },
    title: {
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: '1.3rem',
    },
    content: {
        textAlign: 'left',
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.25)'
    },
    voters: {
        backgroundColor: '#EEC13F',
        borderRadius: '10px',
        marginBottom: '20px',
        color: '#bdbdbd',
        fontFamily: 'Roboto',
        padding: '40px',
        marginTop: 0
    },
    breadcrumb: {
        textAlign: 'left',
        fontWeight: 700,
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Roboto',
        paddingBottom: '0.5em'
    },
    buttonBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '20 20 20 20',
        marginTop: '1.5em',
    },
    detail: {
        padding: '1em',
        borderRadius: '10px',
        fontWeight: 'bold',
        width: '150px',
        backgroundColor: '#C4C4C4',
        color: '#ffffff',
        border: 0
    },
    extraButton: {
        padding: '1em',
        borderRadius: '10px',
        fontWeight: 'bold',
        backgroundColor: '#1D5470',
        color: '#ffffff',
        width: '150px',
        border: 0
    },
}

const ProposalDetail = () => {
    const [proposal, setProposal] = useState([])
    const [proposer, setProposer] = useState({
        proposal_id: -1,
        proposer: ''
    })
    let { id } = useParams();
    const [show, setShow] = useState(false)

    useEffect(() => {
        (async () => {
            const res = await getProposal(id)
            const proposalById = res.result
            const proposer = await getProposer(id)
            if (proposalById.status === 1 || proposalById.status === 2) {
                const tally = await getTally(proposalById.id)
                proposalById.tally = tally.result
            }
            setProposer({ ...proposer.result })
            setProposal([proposalById])
        })()
    }, [id])

    const handleClose = () => {
        setShow(false)
    }

    const wrapSetShow = useCallback((val) => {
        setShow(val)
    }, [setShow])

    const getTime = (string) => {
        const date = new Date(string)
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        return `${hour}:${minute}:${second}`
    }

    console.log(proposal[0])

    const getStatus = () => {
        if (proposal[0].status === 3) {
            return (
                <span style={{
                    color: '#31bdac',
                    backgroundColor: '#2A9D8F',
                    fontWeight: '400',
                    padding: '0.3em',
                    borderRadius: '5px',
                    marginRight: '0.5em',
                    marginLeft: '0.5em',
                }}>
                    Passed
                </span>)
        }
        else if (proposal[0].status === 4) {
            return (
                <span style={{
                    color: '#ff977d',
                    backgroundColor: '#E76F51',
                    fontWeight: '400',
                    padding: '0.3em',
                    borderRadius: '5px',
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
                    fontWeight: '400',
                    padding: '0.3em',
                    borderRadius: '5px',
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
                    backgroundColor: '#1D5470',
                    fontWeight: '400',
                    padding: '0.3em',
                    borderRadius: '5px',
                    marginRight: '0.5em',
                    marginLeft: '0.5em',
                }}>
                    Voting
                </span>
            )
        }
    }

    const handleClick = () => {
        setShow(true)
    }

    return (
        <div style={{
            padding: 140,
            paddingTop: 20
        }}>
            <div style={style.breadcrumb}>
                <span>
                    <Link to='/' style={{ color: '#ffffff', fontWeight: 500 }}>
                        Homepage
                    </Link>
                </span>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>
                    {' / '}
                </span>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>
                    <Link to='/proposals' style={{ color: '#ffffff', fontWeight: 500 }}>
                        Proposals
                    </Link>
                </span>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>
                    {' / '}
                </span>
                <span style={{ color: '#ED9D26' }}>
                    {id}
                </span>
            </div>
            <div style={{
                    textAlign: 'left',
                    fontSize: '48px',
                    color: '#ffffff',
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    marginBottom: '1.3em'
                }}>
                    DETAILS
                </div>
            <div style={style.card}>
                <div style={style.content}>
                    <div style={style.title}>
                        <p className='title' style={style.title}>
                            #{proposal.length > 0 && proposal[0].id}
                            {proposal.length > 0 && getStatus()}
                            {proposal.length > 0 && proposal[0].content.value.title}
                        </p>
                    </div>
                    <div className="line" >
                        <p className="left">
                            Proposal ID
                        </p>
                        <p className="right">
                            {proposal.length > 0 && proposal[0].id || 0}
                        </p>
                    </div>
                    <div className="line">
                        <p className="left">
                            Proposer
                        </p>
                        <Link className="right" to={`/accounts/${proposer.proposer}`} style={{textAlign: 'left'}}>
                            <p style={{ color: '#ED9D26' }}>
                                {proposer.proposer}
                            </p>
                        </Link>
                    </div>
                    <div className="line" >
                        <p className="left">
                            Total Deposit
                        </p>
                        <p className="right">
                            {proposal.length > 0 &&
                                proposal[0].total_deposit.length > 0 &&
                                parseInt(proposal[0].total_deposit[0].amount) / 1000000}
                        </p>
                    </div>
                    <div className="line">
                        <p className="left">
                            Submited Time
                        </p>
                        <p className="right">
                            {proposal.length > 0 &&
                                `${proposal[0].submit_time.split('T')[0]} ${getTime(proposal[0].submit_time)}`}
                        </p>
                    </div>
                    <div className="line" >
                        <p className="left">
                            Voting Time
                        </p>
                        <p className="right">
                            {proposal.length > 0 &&
                                `${proposal[0].voting_start_time.split('T')[0]} ${getTime(proposal[0].voting_start_time)}-${proposal[0].voting_end_time.split('T')[0]} ${getTime(proposal[0].voting_end_time)}`}
                        </p>
                    </div>
                    <div className="line">
                        <p className="left">
                            Proposal Type
                        </p>
                        <p className="right">
                            {proposal.length > 0 && proposal[0].content.type}
                        </p>
                    </div>
                    <div className="line" >
                        <p className="left">
                            Title
                        </p>
                        <p className="right">
                            {proposal.length > 0 && proposal[0].content.value.title}
                        </p>
                    </div>
                    <div className="line">
                        <p className="left">
                            Description
                        </p>
                        <p className="right">
                            {proposal.length > 0 && proposal[0].content.value.description}
                        </p>
                    </div>
                    <div style={{ borderTop: 'solid 1.5px black' }} />
                    <div style={style.buttonBox}>
                        <Link to={`/proposals`}>
                            <button style={style.detail}>
                                Back to List
                            </button>
                        </Link>
                        {
                            proposal.length > 0 && proposal[0].status === 2 && (
                                <button style={style.extraButton} onClick={handleClick}>
                                    <RiBarChart2Fill style={{ fontSize: '1.5em' }} /> Vote
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
            <div style={{ ...style.voters, paddingTop: '30px'}} >
                {proposal.length > 0 && <VoterList proposal={proposal[0]} />}
            </div>
            <>
                <Modal show={show} onHide={handleClose} backdrop="static" >
                    <Modal.Header style={{
                            backgroundColor: '#4D4D4D',
                            color: '#EEC13F',
                            fontFamily: 'Roboto',
                            fontSize: '24px',
                            fontWeight: 400,
                            border: 0
                        }}>
                        <div>
                            Vote
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#4D4D4D', }}>
                        {proposal.length > 0 && <VoteModal proposal={proposal[0]} id={proposal[0].id} wrapSetShow={wrapSetShow} />}
                    </Modal.Body>
                </Modal>
            </>
        </div>
    )
}

export default ProposalDetail