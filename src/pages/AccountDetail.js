import { Typography, } from 'antd';
import { PieChart } from 'react-minimal-pie-chart';
import DelegationList from '../components/DelegationList';
import {
    useParams
} from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import { Modal, } from 'react-bootstrap'
import TransferModal from "../components/TransferModal"
import { getStargateClient, getKeplr } from '../helpers/getKeplr';
import { BsGraphUp, BsGraphDown, BsWallet, BsLock } from "react-icons/bs";
import { getDelegation, getBalance, getReward, getUnbond } from '../helpers/getBalances';

const { Title, Paragraph } = Typography;

const style = {
    container: {
        padding: 50
    },
    assetBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingLeft: 50,
        paddingRight: 50
    },
    assetChart: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
        paddingLeft: 50,
        paddingRight: 50,
    },
    asset: {
        backgroundColor: '#50426B',
        borderRadius: '20px',
        marginBottom: '20px',
        color: '#bdbdbd',
        fontFamily: 'Ubuntu',
        marginTop: '2rem'
    },
    button: {
        border: 0,
        borderRadius: '10px',
        width: '100%',
        height: '40px',
        margin: 10,
        marginBottom: 0,
        marginLeft: 0,
        fontFamily: 'ubuntu',
        fontWeight: 600,
        backgroundColor: '#AC99CF',
        color: '#F6F3FB'
    },
    icon: {
        fontSize: '1.5rem',
    },
    li: {
        margin: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '65rem'
    },
    iconDiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
    }
}

const AccountDetail = ({ accounts }) => {
    const [show, setShow] = useState(false)
    const [selectAcc, setSelectAcc] = useState(0)
    const [asset, setAsset] = useState({
        balance: '132323',
        delegation: '3423422565',
        reward: '1',
        unbonding: '1'
    })
    let { id } = useParams();

    const wrapSetShowTransferModal = useCallback((val) => {
        setShow(val)
    }, [setShow])

    const handleClose = () => {
        setShow(false)
    }

    const handleClick = () => {
        setShow(true)
    }

    useEffect(() => {
        (async () => {
            accounts.map((account, index) => {
                if (account.type === 'keplr') {
                    if (account.account.address !== id) {
                        setSelectAcc(index)
                    }
                }
                if (account.type === 'metamask') {
                    if (account.account === id) {
                        setSelectAcc(index)
                    }
                }
            })
            const delegate = await getDelegation(id)
            const balance = await getBalance(id)
            const reward = await getReward(id)
            const unbonding = await getUnbond(id)
            // const { offlineSigner } = await getKeplr();

            // const client = await getStargateClient(offlineSigner)

            // const balance = await client.getDelegation(id)

            // console.log(balance)
        })()
    }, [id])

    return (
        <div style={style.container}>
            <div style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '3rem', color: '#EFCF20', fontFamily: 'Ubuntu', fontWeight: 600, }}>
                Account Info
            </div>
            <div>
                <Paragraph copyable={{ text: id }}
                    style={{
                        color: '#2a3158',
                        fontFamily: 'Merriweather',
                        textAlign: 'left',
                        backgroundColor: '#50426B',
                        color: '#bdbdbd',
                        padding: 20,
                        borderRadius: '20px',
                        fontSize: '1.2rem'
                    }}>
                    <p style={{ fontSize: '1.2rem', padding: 0 }}>
                        Address
                    </p>
                    {id}
                </Paragraph>
            </div>
            <div style={style.asset}>
                <div style={style.assetBlock}>
                    <Title style={{ color: '#F6F3FB', fontSize: '2rem', fontWeight: 500, fontFamily: 'Ubuntu' }}>
                        Assets
                    </Title>
                    <div style={{ width: '10%' }}>
                        <button style={style.button} onClick={handleClick}>
                            Transfer
                        </button>
                    </div>
                </div>
                <div style={style.assetChart}>
                    <div style={{ padding: 0 }}>
                        <PieChart
                            animate={true}
                            radius={PieChart.defaultProps.radius - 7}
                            data={[
                                { title: 'One', value: 10, color: '#E38627' },
                                { title: 'Two', value: 15, color: '#C13C37' },
                                { title: 'Three', value: 20, color: '#6A2135' },
                            ]}
                            style={{ marginLeft: '50px' }}
                        />
                    </div>
                    <hr style={{
                        border: 'none',
                        bordeLeft: '1px solid hsla(200, 10%, 50%,100)',
                        height: 'auto',
                        width: '2px',
                        marginLeft: '10rem'
                    }} />
                    <ul style={{ margin: 'auto', padding: 0, marginLeft: '10rem', listStyleType: 'none', textAlign: 'left', fontSize: '1.25rem', paddingBottom: '10rem' }}>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ padding: 5, backgroundColor: '#b8ffcf', opacity: 0.6, borderRadius: '10px', paddingLeft: 12, paddingRight: 12 }}>
                                    <BsWallet style={{ ...style.icon, color: '#2adb71' }} />
                                </div>
                                <p style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontWeight: 600 }}>
                                    Balance
                                </p>
                            </div>
                            <div>
                                {asset.balance} DIG
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ padding: 5, backgroundColor: '#a2adfa', opacity: 0.6, borderRadius: '10px', paddingLeft: 12, paddingRight: 12 }}>
                                    <BsLock style={{ ...style.icon, color: '#2b32ff' }} />
                                </div>
                                <p style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontWeight: 600 }}>
                                    Delegation
                                </p>
                            </div>
                            <div>
                                {asset.delegation} DIG
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ padding: 5, backgroundColor: '#ffcc91', opacity: 0.6, borderRadius: '10px', paddingLeft: 12, paddingRight: 12 }}>
                                    <BsGraphUp style={{ ...style.icon, color: '#fc9619' }} />
                                </div>
                                <p style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontWeight: 600 }}>
                                    reward
                                </p>
                            </div>
                            <div>
                                {asset.reward} DIG
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ padding: 5, backgroundColor: '#ffa1a1', opacity: 0.6, borderRadius: '10px', paddingLeft: 12, paddingRight: 12 }}>
                                    <BsGraphDown style={{ ...style.icon, color: '#ff3636' }} />
                                </div>
                                <p style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontWeight: 600 }}>
                                    Unbonding
                                </p>
                            </div>
                            <div>
                                {asset.unbonding} DIG
                            </div>
                        </li>
                    </ul>
                    <hr/>
                </div>
            </div>
            <div>
                <DelegationList />
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

export default AccountDetail