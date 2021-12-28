import ProfileCard from "../components/ProfileCard"
import ConnectButton from "../components/ConnectButton"
import { Modal, } from 'react-bootstrap'
import TransferModal from "../components/TransferModal"
import { useCallback, useState } from "react"

const style = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        paddingLeft: '40rem',
        paddingBottom: '20px'
    },
    card: {
        margin: 10,
    },
    button: {
        marginTop: '3rem',
        textAlign: 'left',
    },
}

const AccountList = ({ accounts, wrapSetShow }) => {
    const [show, setShow] = useState(false)
    const [selectAcc, setSelectAcc] = useState(0)

    const wrapSetShowTransferModal = useCallback((val) => {
        setShow(val)
    }, [setShow])

    const wrapSetSelect = useCallback((val) => {
        setSelectAcc(val)
    }, [setShow])

    const handleClose = () => {
        setShow(false)
    }
    return (
        <div style={style.container}>
            <div style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '3rem', color: '#EFCF20', fontFamily: 'Ubuntu', fontWeight: 600, }}>
                Accounts
            </div>
            {accounts.map((account, index) => (
                <div style={style.card}>
                    <ProfileCard account={account} index={index} wrapSetSelect={wrapSetSelect} wrapSetShow={wrapSetShowTransferModal} />
                </div>
            ))}
            <div style={style.button}>
                <ConnectButton wrapSetShow={wrapSetShow} />
            </div>
            <>
                <Modal show={show} onHide={handleClose} backdrop="static" >
                    <Modal.Header style={{ backgroundColor: '#201A2B', color: '#F6F3FB', fontFamily: 'ubuntu', fontSize: '1.2rem', fontWeight: 600 }}>
                        <div>
                            Transfer Token
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#604F80', }}>
                        <TransferModal account={accounts[selectAcc]} wrapSetShow={wrapSetShowTransferModal} />
                    </Modal.Body>
                </Modal>
            </>
        </div>
    )
}

export default AccountList