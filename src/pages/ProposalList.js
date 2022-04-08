import ProposalCard from "../components/ProposalCard"
import { Modal, } from 'react-bootstrap'
import VoteModal from "../components/VoteModal"
import { useCallback, useEffect, useState } from "react"
import { getProposals, getBond } from "../helpers/getProposal"
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
        padding: 70,
        paddingTop: '7em'
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
        fontFamily: 'montserrat',
        paddingBottom: '0.5em'
    },
    card: {
        borderRadius: '15px',
        minHeight: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)'
    },
}

const ProposalList = ({ accounts }) => {
    const [show, setShow] = useState(false)
    const [proposals, setProposals] = useState([])
    const [selectProposal, setSelectProposal] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [showCreateProposal, setShowCreateProposal] = useState(false)
    const [showDeposit, setShowDeposit] = useState(false)
    const [bond, setBond] = useState(0)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const res = await getProposals()
            const proposals = res.proposals
            const bondRes = await getBond()
            const bondToken = bondRes.result.bonded_tokens || 0
            proposals.sort((x, y) => y.proposal_id - x.proposal_id)
            setProposals([...proposals])
            setBond(parseInt(bondToken))
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
            <div style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    textAlign: 'left',
                    fontSize: '36px',
                    color: '#ffffff',
                    fontFamily: 'montserrat',
                    fontWeight: 'bold',
                    marginBottom: '50px'
                }}>
                    PROPOSALS
                </div>
                <div>
                    <button
                        onClick={handleClick}
                        style={{
                            border: 0,
                            backgroundImage: 'Linear-Gradient(#EEC13F 0%, #FFAC38 100%)',
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
                        <ProposalCard
                            proposal={proposal}
                            wrapSetShow={wrapSetShow}
                            wrapSetSelect={wrapSetSelect}
                            wrapSetShowDeposit={wrapSetShowDeposit}
                            index={index}
                            bond={bond}
                        />
                    )))}
                </div>
            )
            }
            <>
                <Modal show={show} onHide={handleClose} backdrop="static" >
                    <Modal.Header style={{
                        backgroundColor: '#4D4D4D',
                        color: '#EEC13F',
                        fontFamily: 'montserrat',
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
                        fontFamily: 'montserrat',
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
                        fontFamily: 'montserrat',
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