import ProposalCard from "../components/ProposalCard"
import { Modal, } from 'react-bootstrap'
import VoteModal from "../components/VoteModal"
import { useCallback, useEffect, useState } from "react"
import { getProposals, } from "../helpers/getProposal"
import '../assets/css/ProposalList.css'
import { Link } from "react-router-dom"
import { Skeleton } from "antd"
import CreateProposalModal from "../components/CreateProposalModal"
import DepositModal from "../components/DepositModal"

const style = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: '20px',
        padding: 140,
        paddingTop: 0
    },
    button: {
        marginTop: '3rem',
        textAlign: 'left',
    },
    breadcrumb: {
        textAlign: 'left',
        fontWeight: 700,
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Roboto',
        paddingBottom: '0.5em'
    },
    card: {
        backgroundColor: '#EEC13F',
        borderRadius: '15px',
        minHeight: 'auto',
        boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.25)',
        padding: '40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)'
    },
}

const ProposalList = ({ accounts }) => {
    const [show, setShow] = useState(false)
    const [proposals, setProposals] = useState([])
    const [selectProposal, setSelectProposal] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [showCreateProposal, setShowCreateProposal] = useState(false)
    const [showDeposit, setShowDeposit] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const res = await getProposals()
            const proposals = res.proposals
            proposals.sort((x, y) => y.proposal_id - x.proposal_id)
            setProposals([...proposals])
            setLoading(false)
        })()
    }, [])

    const wrapSetShow = useCallback((val) => {
        setShow(val)
    }, [setShow])

    const wrapSetSelect = useCallback((val) => {
        setSelectProposal(val)
    }, [setSelectProposal])

    const handleClose = () => {
        setShow(false)
    }

    const handleCloseCreateProposal = () => {
        setShowCreateProposal(false)
    }

    const handleClick = () => {
        setShowCreateProposal(true)
    }

    const wrapSetShowCreateProposal = useCallback((val) => {
        setShowCreateProposal(val)
    }, [setShowCreateProposal])

    const wrapSetShowDeposit = useCallback((val) => {
        setShowDeposit(val)
    }, [setShowDeposit])

    const handleEnter = (e) => {
        e.target.style.backgroundImage = 'Linear-Gradient(263.6deg, #4D4D4D 0%, #000000 100%)'
        e.target.style.border = 'solid 2px #EEC13F'
    }

    const handleLeave = (e) => {
        e.target.style.backgroundImage = 'Linear-Gradient(#EEC13F 0%, #FFAC38 100%)'
    }

    return (
        <div style={style.container}>
            <div style={style.breadcrumb}>
                <span>
                    <Link to='/' style={{ color: '#ffffff', fontWeight: 500 }}>
                        Homepage
                    </Link>
                </span>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>
                    {' / '}
                </span>
                <span style={{ color: '#ED9D26' }}>
                    Proposals
                </span>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    textAlign: 'left',
                    fontSize: '48px',
                    color: '#ffffff',
                    fontFamily: 'Roboto',
                    fontWeight: 700,
                    marginBottom: '1.3em'
                }}>
                    PROPOSALS
                </div>
                <div>
                    <button
                        onClick={handleClick}
                        style={{
                            border: 0,
                            backgroundColor: '#eec13f',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '24px',
                            padding: '10px 20px 10px 20px',
                            borderRadius: '10px'
                        }} onMouseOver={handleEnter} onMouseLeave={handleLeave}>
                        Create Proposal
                    </button>
                </div>
            </div>
            {loading && proposals.length === 0 ? (
                <div style={style.card}>
                    <Skeleton active style={{
                        backgroundColor: '#ffffff',
                        padding: '30px',
                        borderRadius: '15px'
                    }} />
                </div>
            ) : (
                <div className="gridBox">
                    {(proposals.map((proposal, index) => (
                        <ProposalCard proposal={proposal} wrapSetShow={wrapSetShow} wrapSetSelect={wrapSetSelect} wrapSetShowDeposit={wrapSetShowDeposit} index={index} />
                    )))}
                </div>
            )
            }
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
                        <VoteModal proposal={proposals[selectProposal]} id={proposals[selectProposal] && proposals[selectProposal].proposal_id} wrapSetShow={wrapSetShow} />
                    </Modal.Body>
                </Modal>
            </>
            <>
                <Modal show={showDeposit} onHide={handleClose} backdrop="static" >
                    <Modal.Header style={{
                        backgroundColor: '#4D4D4D',
                        color: '#EEC13F',
                        fontFamily: 'Roboto',
                        fontSize: '24px',
                        fontWeight: 400,
                        border: 0
                    }}>
                        <div>
                            Deposit
                            <p style={{
                                fontSize: '10px',
                                color: 'red'
                            }}>
                                *0x accounts are not supported yet
                            </p>
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#4D4D4D', }}>
                        <DepositModal accounts={accounts} wrapSetShow={wrapSetShowDeposit} id={proposals[selectProposal] && proposals[selectProposal].proposal_id} />
                    </Modal.Body>
                </Modal>
            </>
            <>
                <Modal show={showCreateProposal} onHide={handleCloseCreateProposal} backdrop="static" >
                    <Modal.Header style={{
                        backgroundColor: '#4D4D4D',
                        color: '#EEC13F',
                        fontFamily: 'Roboto',
                        fontSize: '24px',
                        fontWeight: 400,
                        border: 0
                    }}>
                        <div>
                            Create Proposal
                            <p style={{
                                fontSize: '10px',
                                color: 'red'
                            }}>
                                *0x accounts are not supported yet
                            </p>
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#4D4D4D', }}>
                        <CreateProposalModal accounts={accounts} wrapSetShow={wrapSetShowCreateProposal} />
                    </Modal.Body>
                </Modal>
            </>
        </div>
    )
}

export default ProposalList