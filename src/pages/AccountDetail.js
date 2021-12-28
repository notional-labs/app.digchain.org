import { Typography, } from 'antd';
import { PieChart } from 'react-minimal-pie-chart';
import DelegationList from '../components/DelegationList';
import {
    useParams
} from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import { Modal, } from 'react-bootstrap'
import TransferModal from "../components/TransferModal"
import { BsGraphUp, BsGraphDown, BsWallet, BsLock } from "react-icons/bs";
import { getAsset, getTotalDelegate, getTotalUnbonding } from '../helpers/getBalances';

const { Title, Paragraph } = Typography;

const style = {
    container: {
        padding: 50,
        paddingTop: 20
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
        marginTop: '4rem'
    },
    delegation:{
        backgroundColor: '#50426B',
        borderRadius: '20px',
        marginBottom: '20px',
        color: '#bdbdbd',
        fontFamily: 'Ubuntu',
        marginTop: '4rem',
        padding: 20
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
        balance: '',
        delegation: '',
        reward: '',
        unbonding: ''
    })
    const [reward, setReward] = useState([])
    const [delegation, setDelegation] = useState([])
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
                    if (account.account.address === id) {
                        setSelectAcc(index)
                    }
                }
                if (account.type === 'metamask') {
                    if (account.account === id) {
                        setSelectAcc(index)
                    }
                }
            })
            const asset = await getAsset(id)
            setAsset({
                balance: asset[0].length > 0 && asset[0][0].length > 0 ? asset[0][0][0].amount : 0,
                delegation: asset[1].delegation_responses.length > 0 ? getTotalDelegate(asset[1].delegation_responses) : 0,
                reward: asset[2].total.length > 0 ? asset[2].total[0].amount : 0,
                unbonding: asset[3].unbonding_responses.length > 0 ? getTotalUnbonding(asset[3].unbonding_responses) : 0
            })
            setDelegation([...asset[1].delegation_responses])
            setReward([...asset[2].rewards])
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
                        Address:
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
                                { title: 'Balance', value: parseFloat(asset.balance), color: '#b8ffcf' },
                                { title: 'Delegation', value: parseFloat(asset.delegation), color: '#a2adfa' },
                                { title: 'Reward', value: parseFloat(asset.reward), color: '#ffcc91' },
                                { title: 'Undonding', value: parseFloat(asset.unbonding), color: '#ffa1a1' }
                            ]}
                            style={{ marginLeft: '50px', }}
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
                                <div style={{ padding: 5, backgroundColor: '#b8ffcf', borderRadius: '10px', paddingLeft: 12, paddingRight: 12 }}>
                                    <BsWallet style={{ ...style.icon, color: '#2adb71' }} />
                                </div>
                                <p style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontWeight: 600 }}>
                                    Balance
                                </p>
                            </div>
                            <div style={{ fontWeight: 600 }}>
                                {parseInt(asset.balance)/1000000} DIG
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ padding: 5, backgroundColor: '#a2adfa', borderRadius: '10px', paddingLeft: 12, paddingRight: 12 }}>
                                    <BsLock style={{ ...style.icon, color: '#2b32ff' }} />
                                </div>
                                <p style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontWeight: 600 }}>
                                    Delegation
                                </p>
                            </div>
                            <div style={{ fontWeight: 600 }}>
                                {parseInt(asset.delegation)/1000000} DIG
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ padding: 5, backgroundColor: '#ffcc91', borderRadius: '10px', paddingLeft: 12, paddingRight: 12 }}>
                                    <BsGraphUp style={{ ...style.icon, color: '#fc9619' }} />
                                </div>
                                <p style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontWeight: 600 }}>
                                    reward
                                </p>
                            </div>
                            <div style={{ fontWeight: 600 }}>
                                {parseInt(asset.reward)/1000000} DIG
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ padding: 5, backgroundColor: '#ffa1a1', borderRadius: '10px', paddingLeft: 12, paddingRight: 12 }}>
                                    <BsGraphDown style={{ ...style.icon, color: '#ff3636' }} />
                                </div>
                                <p style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontWeight: 600 }}>
                                    Unbonding
                                </p>
                            </div>
                            <div style={{ fontWeight: 600 }}>
                                {parseInt(asset.unbonding)/1000000} DIG
                            </div>
                        </li>
                    </ul>
                    <hr />
                </div>
            </div>
            <div style={{...style.delegation, marginTop: 0}}>
                <DelegationList delegations={delegation} rewards={reward}/>
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