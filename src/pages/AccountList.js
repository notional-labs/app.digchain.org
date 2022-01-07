import ProfileCard from "../components/ProfileCard"
import ConnectButton from "../components/ConnectButton"
import { Modal, } from 'react-bootstrap'
import TransferModal from "../components/TransferModal"
import { useCallback, useState } from "react"
import { ImFloppyDisk } from "react-icons/im";

const style = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: '20px',
        padding: 60
    },
    card: {
        margin: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        marginTop: '3rem',
        textAlign: 'left',
    },
}

const AccountList = ({ accounts, wrapSetAccounts }) => {
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
            <div style={{
                marginBottom: '0.5rem',
                fontSize: '3rem',
                color: '#EFCF20',
                fontFamily: 'Ubuntu',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                paddingRight: '13em'
            }}>
                Accounts
            </div>
            {accounts.length > 0 ?
                <div style={{minHeight: '55vh'}}>
                    {(accounts.map((account, index) => (
                        <div style={style.card}>
                            <ProfileCard account={account} index={index} wrapSetSelect={wrapSetSelect} wrapSetShow={wrapSetShowTransferModal} wrapSetAccounts={wrapSetAccounts} />
                        </div>
                    )))}
                </div> : (
                    <div style={{ color: '#ffc16b', height: '55vh', paddingTop: '15em', fontFamily: 'Ubuntu' }}>
                        <ImFloppyDisk style={{ fontSize: '10rem', opacity: 0.2, }} />
                        <p style={{ fontSize: '2rem', opacity: 0.2, paddingTop: '1em', marginBottom: 0 }}>
                            No accounts yet
                        </p>
                        <p style={{ fontSize: '2rem', opacity: 0.2, padding: 0, margin: 0 }}>
                            Click connect button to add account
                        </p>
                    </div>
                )
            }
            <>
                <Modal show={show} onHide={handleClose} backdrop="static" >
                    <Modal.Header style={{ backgroundColor: '#d6d6d6', color: '#696969', fontFamily: 'ubuntu', fontSize: '1.2rem', fontWeight: 600 }}>
                        <div>
                            Transfer Token
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#1f1f1f', }}>
                        <TransferModal account={accounts[selectAcc]}
                            wrapSetShow={wrapSetShowTransferModal}
                        />
                    </Modal.Body>
                </Modal>
            </>
        </div>
    )
}

export default AccountList