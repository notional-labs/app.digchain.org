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
        justifyContent: 'space-between',
        padding: '3em',
        width: '100%',
        paddingTop: 0
    },
    asset: {
        backgroundColor: 'rgb(255, 255, 255, 0.4)',
        borderRadius: '10px',
        marginBottom: '20px',
        color: '#696969',
        fontFamily: 'Ubuntu',
        marginTop: '20px',
    },
    delegation: {
        backgroundColor: 'rgb(255, 255, 255, 0.4)',
        borderRadius: '10px',
        marginBottom: '20px',
        color: '#bdbdbd',
        fontFamily: 'Ubuntu',
        marginTop: '5rem',
        padding: 20
    },
    button: {
        border: 0,
        borderRadius: '30px',
        width: '100%',
        marginBottom: 0,
        marginLeft: 0,
        fontFamily: 'ubuntu',
        fontWeight: 600,
        backgroundColor: '#2e2c27',
        color: '#F6F3FB',
        padding: '2em',
        paddingTop: '1em',
        paddingBottom: '1em'
    },
    icon: {
        fontSize: '1.5rem',
    },
    li: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignContent: 'center',
        marginBottom: '0.5em',
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
            <div>
                <Paragraph copyable={{ text: id && id.trim() }}
                    style={{
                        fontFamily: 'Merriweather',
                        textAlign: 'left',
                        backgroundColor: 'rgb(255, 255, 255, 0.4)',
                        color: '#1c1c1c',
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
                    <div style={{
                        width: '40%', margin: 'auto',
                        backgroundColor: 'rgb(255, 255, 255, 1)',
                        borderRadius: '20px',
                        marginRight: '2em'
                    }}>
                        <PieChart
                            animationDuration={20000}
                            startAngle={-90}
                            radius={35}
                            data={[
                                { title: 'Balance', value: parseInt(asset.balance) / 1000000 || 0, color: '#28c76f' },
                                { title: 'Delegation', value: parseInt(asset.delegation) / 1000000 || 0, color: '#7367f0' },
                                { title: 'Reward', value: parseInt(asset.reward) / 1000000 || 0, color: '#ff9f43' },
                                { title: 'Undonding', value: parseInt(asset.unbonding) / 1000000 || 0, color: '#ea5455' }
                            ]}
                        >
                            <PieChart
                                radius={25}
                                data={[
                                    { title: 'asset', value: 1, color: 'rgb(255, 255, 255, 1)' },
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
                    <ul style={{
                        textAlign: 'left',
                        margin: 0,
                        padding: '2em',
                        listStyleType: 'none',
                        textAlign: 'left',
                        fontSize: '1.25rem',
                        width: '100%',
                        backgroundColor: 'rgb(255, 255, 255, 1)',
                        borderRadius: '20px'
                    }}>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ backgroundColor: 'rgb(61, 255, 148, 0.4)', height: '100%', padding: '0.5em', borderRadius: '10px' }}>
                                    <BsWallet style={{ ...style.icon, color: '#28c76f' }} />
                                </div>
                                <p style={{ marginLeft: '10px', fontWeight: 500, marginBottom: 0 }}>
                                    <span style={{
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        lineheight: 'normal',
                                        marginTop: '0.5em'
                                    }}>
                                        Balance
                                    </span>
                                </p>
                            </div>
                            <div style={{ fontWeight: 500 }}>
                                <span style={{
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    lineheight: 'normal',
                                    marginTop: '0.5em'
                                }}>
                                    {parseInt(asset.balance) / 1000000 || 0} DIG
                                </span>
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ backgroundColor: 'rgb(140, 129, 252, 0.4)', height: '100%', padding: '0.5em', borderRadius: '10px' }}>
                                    <BsLock style={{ ...style.icon, color: '#7367f0' }} />
                                </div>
                                <p style={{ marginLeft: '10px', fontWeight: 500, marginBottom: 0 }}>
                                    <span style={{
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        lineheight: 'normal',
                                        marginTop: '0.5em'
                                    }}>
                                        Delegation
                                    </span>
                                </p>
                            </div>
                            <div style={{ fontWeight: 500 }}>
                                <span style={{
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    lineheight: 'normal',
                                    marginTop: '0.5em'
                                }}>
                                    {parseInt(asset.delegation) / 1000000 || 0} DIG
                                </span>
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ backgroundColor: 'rgb(255, 174, 97, 0.4)', height: '100%', padding: '0.5em', borderRadius: '10px' }}>
                                    <BsGraphUp style={{ ...style.icon, color: '#ff9f43' }} />
                                </div>
                                <p style={{ marginLeft: '10px', fontWeight: 500, marginBottom: 0 }}>
                                    <span style={{
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        lineheight: 'normal',
                                        marginTop: '0.5em'
                                    }}>
                                        Reward
                                    </span>
                                </p>
                            </div>
                            <div style={{ fontWeight: 500 }}>
                                <span style={{
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    lineheight: 'normal',
                                    marginTop: '0.5em'
                                }}>
                                    {parseInt(asset.reward) / 1000000 || 0} DIG
                                </span>
                            </div>
                        </li>
                        <li style={style.li}>
                            <div style={style.iconDiv}>
                                <div style={{ backgroundColor: 'rgb(255, 115, 116, 0.4)', height: '100%', padding: '0.5em', borderRadius: '10px' }}>
                                    <BsGraphDown style={{ ...style.icon, color: '#ea5455' }} />
                                </div>
                                <p style={{ marginLeft: '10px', fontWeight: 500, marginBottom: 0 }}>
                                    <span style={{
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                        lineheight: 'normal',
                                        marginTop: '0.5em'
                                    }}>
                                        Unbonding
                                    </span>
                                </p>
                            </div>
                            <div style={{ fontWeight: 500 }}>
                                <span style={{
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    lineheight: 'normal',
                                    marginTop: '0.5em'
                                }}>
                                    {parseInt(asset.unbonding) / 1000000 || 0} DIG
                                </span>
                            </div>
                        </li>
                        <li>
                            <hr style={{ color: 'black' }} />
                        </li>
                        <li style={{...style.li, justifyContent: 'end'}}>
                            <div style={{ fontWeight: 600, fontSize: '1.5rem' }}>
                                <span style={{
                                    display: 'inline-block',
                                    verticalAlign: 'middle',
                                    lineheight: 'normal',
                                }}>
                                    Total 0$
                                </span>
                            </div>
                        </li>
                    </ul>
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