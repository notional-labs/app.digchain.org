import ProposalCard from "../components/ProposalCard"
import { Modal, } from 'react-bootstrap'
import VoteModal from "../components/VoteModal"
import { useCallback, useEffect, useState } from "react"
import { getProposals, } from "../helpers/getProposal"
import '../assets/css/ProposalList.css'

const style = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: '20px',
        padding: 60
    },
    button: {
        marginTop: '3rem',
        textAlign: 'left',
    },
}

const ProposalList = () => {
    const [show, setShow] = useState(false)
    const [proposals, setProposals] = useState([])

    useEffect(() => {
        (async () => {
            const res = await getProposals()
            const proposals = res.proposals
            proposals.sort((x, y) => y.proposal_id - x.proposal_id)
            setProposals([...proposals])
        })()
    }, [])

    const wrapSetShow = useCallback((val) => {
        setShow(val)
    }, [setShow])

    const handleClose = () => {
        setShow(false)
    }

    return (
        <div style={style.container}>
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
                Proposals
            </div>
            {proposals.length > 0 &&
                <div className="gridBox">
                    {(proposals.map((proposal) => (
                        <ProposalCard proposal={proposal} wrapSetShow={wrapSetShow} />
                    )))}
                </div>
            }
            <>
                <Modal show={show} onHide={handleClose} backdrop="static" >
                    <Modal.Header style={{ backgroundColor: '#d6d6d6', color: '#696969', fontFamily: 'ubuntu', fontSize: '1.2rem', fontWeight: 600 }}>
                        <div>
                            Vote
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#1f1f1f', }}>
                        <VoteModal wrapSetShow={wrapSetShow} />
                    </Modal.Body>
                </Modal>
            </>
        </div>
    )
}

export default ProposalList