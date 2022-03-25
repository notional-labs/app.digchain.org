import ProfileCard from "../components/ProfileCard"
import { Modal, } from 'react-bootstrap'
import TransferModal from "../components/TransferModal"
import { useCallback, useState } from "react"
import { ImFloppyDisk } from "react-icons/im";
import { Breadcrumb } from "antd"
import { Link } from "react-router-dom";


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
    card: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',

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
                textAlign: 'left',
                fontSize: '36px',
                color: '#ffffff',
                fontFamily: 'montserrat',
                fontWeight: 'bold',
                marginBottom: '50px'
            }}>
                ACCOUNTS
            </div>
            {accounts.length > 0 ?
                <div className="gridBoxAccount">
                    {(accounts.map((account, index) => (
                        <ProfileCard account={account} index={index} wrapSetSelect={wrapSetSelect} wrapSetShow={wrapSetShowTransferModal} wrapSetAccounts={wrapSetAccounts} />
                    )))}
                </div> : (
                    <div style={{ color: '#ffc16b', height: '55vh', paddingTop: '15em', fontFamily: 'montserrat' }}>
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
                <Modal.Header style={{
                            backgroundColor: '#4D4D4D',
                            color: '#EEC13F',
                            fontFamily: 'montserrat',
                            fontSize: '24px',
                            fontWeight: 400,
                            border: 0
                        }}>
                        <div>
                            Transfer Token
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#4D4D4D', }}>
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