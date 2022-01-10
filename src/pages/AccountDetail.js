import { Typography, Breadcrumb } from 'antd';
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
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import TxList from '../components/TxList';

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
        width: '100%'
    },
    asset: {
        backgroundColor: '#ffc16b',
        borderRadius: '10px',
        marginBottom: '20px',
        color: '#696969',
        fontFamily: 'Ubuntu',
        marginTop: '0rem'
    },
    delegation: {
        backgroundColor: '#ffc16b',
        borderRadius: '10px',
        marginBottom: '20px',
        color: '#bdbdbd',
        fontFamily: 'Ubuntu',
        marginTop: '5rem',
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
        backgroundColor: '#2e2c27',
        color: '#F6F3FB'
    },
    icon: {
        fontSize: '1.5rem',
    },
    li: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignContent: 'center'
    },
    iconDiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignContent: 'stretch'
    }
}

const AccountDetail = ({ accounts, wrapSetPage }) => {
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
            <div >
                <Paragraph copyable={{ text: id && id.trim() }}
                    style={{
                        color: '#2a3158',
                        fontFamily: 'Merriweather',
                        textAlign: 'left',
                        backgroundColor: '#ffc16b',
                        color: '#696969',
                        padding: 20,
                        borderRadius: '10px',
                        fontSize: '1.2rem',
                        marginBottom: '0.5em'
                    }}>
                    <p style={{ fontSize: '1.2rem', padding: 0 }}>
                        Address:
                    </p>
                    {id}
                </Paragraph>
            </div>
            <Breadcrumb style={{ textAlign: 'left', margin: 0, fontSize: '1.2rem', color: 'white', marginBottom: '0.5em', }}>
                <Breadcrumb.Item href="/">
                    <span style={{ color: '#1778ff' }}>
                        Home
                    </span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="/accounts">
                    <span style={{ color: '#1778ff' }}>
                        Accounts
                    </span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <span style={{ color: 'white' }}>
                        Account Details
                    </span>
                </Breadcrumb.Item>
            </Breadcrumb>
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
                    <div style={{ padding: 0, marginLeft: 100, marginBottom: 20, paddingRight: '15rem', width: '40%' }}>
                        <PieChart
                            animationDuration={20000}
                            startAngle={-90}
                            radius={50}
                            data={[
                                { title: 'Balance', value: parseInt(asset.balance) / 1000000 || 0, color: '#6ab1f7' },
                                { title: 'Delegation', value: parseInt(asset.delegation) / 1000000 || 0, color: '#7dff95' },
                                { title: 'Reward', value: parseInt(asset.reward) / 1000000 || 0, color: '#ff8e80' },
                                { title: 'Undonding', value: parseInt(asset.unbonding) / 1000000 || 0, color: '#e491ff' }
                            ]}
                            style={{ marginLeft: '50px', }}
                        >
                            <PieChart
                                radius={30}
                                data={[
                                    { title: 'asset', value: 1, color: '#ffc16b' },
                                ]}
                                style={{ marginLeft: '50px', }}
                            />
                        </PieChart>
                        {/* <ChartDonut
                            ariaDesc="Average number of pets"
                            ariaTitle="Donut chart example"
                            constrainToVisibleArea={false}
                            data={[
                                { x: 'Balance', y: parseInt(asset.balance) / 1000000, color: '#b8ffcf' },
                                { x: 'Delegation', y: parseInt(asset.delegation) / 1000000, color: '#a2adfa' },
                                { x: 'Reward', y: parseInt(asset.reward) / 1000000, color: '#ffcc91' },
                                { x: 'Undonding', y: parseInt(asset.unbonding) / 1000000, color: '#ffa1a1' },
                            ]}
                            labels={({ datum }) => `${datum.x}: ${datum.y} DIG`}
                            themeColor={ChartThemeColor.multiOrdered}
                            innerRadius={70}
                            radius={110}
                            startAngle={0}
                        /> */}
                    </div>
                    <hr style={{
                        border: 'none',
                        bordeLeft: '1px solid white',
                        height: 'auto',
                        width: '4px',
                    }} />
                    <ul style={{
                        textAlign: 'left',
                        margin: 'auto',
                        padding: 0,
                        marginLeft: '10rem',
                        listStyleType: 'none',
                        textAlign: 'left',
                        fontSize: '1.25rem',
                        paddingBottom: '10rem',
                        width: '100%',
                        paddingRight: '2em'
                    }}>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{}}>
                                    <BsWallet style={{ ...style.icon, color: '#0b5fb3' }} />
                                </div>
                                <p style={{ marginLeft: '10px', fontWeight: 500 }}>
                                    Balance
                                </p>
                            </div>
                            <div style={{ fontWeight: 500 }}>
                                {parseInt(asset.balance) / 1000000 || 0} DIG
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ }}>
                                    <BsLock style={{ ...style.icon, color: '#0da128' }} />
                                </div>
                                <p style={{ marginLeft: '10px', fontWeight: 500 }}>
                                    Delegation
                                </p>
                            </div>
                            <div style={{ fontWeight: 500 }}>
                                {parseInt(asset.delegation) / 1000000 || 0} DIG
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ }}>
                                    <BsGraphUp style={{ ...style.icon, color: '#c9321e' }} />
                                </div>
                                <p style={{ marginLeft: '10px', fontWeight: 500 }}>
                                    Reward
                                </p>
                            </div>
                            <div style={{ fontWeight: 500 }}>
                                {parseInt(asset.reward) / 1000000 || 0} DIG
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{}}>
                                    <BsGraphDown style={{ ...style.icon, color: '#a020c9' }} />
                                </div>
                                <p style={{ marginLeft: '10px', fontWeight: 500 }}>
                                    Unbonding
                                </p>
                            </div>
                            <div style={{ fontWeight: 500 }}>
                                {parseInt(asset.unbonding) / 1000000 || 0} DIG
                            </div>
                        </li>
                    </ul>
                    <hr />
                </div>
            </div>
            <div style={{ ...style.delegation, marginTop: 0, paddingTop: 0 }}>
                <DelegationList address={id} type={accounts[selectAcc] && accounts[selectAcc].type} delegations={delegation} rewards={reward} wrapSetPage={wrapSetPage} />
            </div>
            <div style={{ ...style.delegation, marginTop: 0, paddingTop: 20 }}>
                <TxList address={id} />
            </div>
            <>
                <Modal show={show} onHide={handleClose} backdrop="static" >
                    <Modal.Header style={{ backgroundColor: '#d6d6d6', color: '#696969', fontFamily: 'ubuntu', fontSize: '1.2rem', fontWeight: 600 }}>
                        <div>
                            Transfer Token
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#1f1f1f', }}>
                        <TransferModal account={accounts[selectAcc]} wrapSetShow={wrapSetShowTransferModal} />
                    </Modal.Body>
                </Modal>
            </>
        </div>
    )
}

export default AccountDetail