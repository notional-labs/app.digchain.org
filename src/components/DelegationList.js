
import { Typography, Tooltip, Skeleton, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { getValidators } from '../helpers/getValidators';
import { getTotal } from '../helpers/getBalances';
import WithDrawModal from './WithDrawModal';
import UndelegateModal from './UndelegateModal';
import ReDelegateModal from './ReDelegateModal';
import { RiLogoutBoxRLine, } from "react-icons/ri";
import { TiArrowRepeat } from "react-icons/ti";
import { AiOutlineGift } from "react-icons/ai";


const { Title, Paragraph } = Typography;

const style = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#ffffff'
    },
    button: {
        border: 0,
        borderRadius: '10px',
        marginBottom: 0,
        marginLeft: 0,
        fontFamily: 'montserrat',
        fontWeight: 300,
        backgroundColor: '#ED9D27',
        color: '#FFFFFF',
        padding: '20px',
        paddingTop: '1em',
        paddingBottom: '1em'
    },
    actionButton: {
        border: 'solid 2px #ffffff',
        backgroundColor: 'transparent',
        padding: 5,
        fontFamily: 'montserrat',
        fontSize: '1rem'
    },
    table: {
        width: '100%',
    },
    tdlHeader: {
        backgroundColor: 'transparent',
        borderBottom: 'solid 1px #ffffff'
    },
    tdlContent: {
        marginTop: '0px',
        borderRadius: '50px',
        paddingTop: 0
    },
    th: {
        padding: '15px 15px',
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: '24px',
        color: '#ffffff',
        textTransform: 'uppercase',
        fontFamily: 'montserrat',
    },
    td: {
        padding: '15px',
        textAlign: 'left',
        verticalAlign: '500',
        fontWeight: 'lighter',
        fontSize: '17px',
        color: '#ffffff',
        fontFamily: 'montserrat',
        width: '20%',
        lineHeight: '18px'
    }
}

const DelegationList = ({ address, type, delegations, rewards, }) => {
    const [validators, setValidators] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectVal, setSelectVal] = useState(0)
    const [showWithdraw, setShowWithdraw] = useState(false)
    const [showUnbonding, setShowUnbonding] = useState(false)
    const [showRedelegate, setShowRedelegate] = useState(false)

    const wrapSetShowWithdrawModal = useCallback((val) => {
        setShowWithdraw(val)
    }, [setShowWithdraw])

    const wrapSetShowUnbondModal = useCallback((val) => {
        setShowUnbonding(val)
    }, [setShowUnbonding])

    const wrapSetShowRedelegate = useCallback((val) => {
        setShowRedelegate(val)
    }, [setShowRedelegate])

    useEffect(() => {
        (async () => {
            setLoading(true)
            let vals = await getValidators(true)
            const totalSupply = getTotal(vals)
            vals = vals.sort((x, y) => y.delegator_shares - x.delegator_shares)
            vals.map((val) => {
                val.votingPowerPercentage = parseFloat(val.delegator_shares * 100 / totalSupply).toFixed(2)
            })
            setValidators([...vals])
            setLoading(false)
        })()
    }, [])

    const handleOver = (e) => {
        e.target.style.backgroundColor = 'rgb(255, 255, 255, 0.3)'
    }

    const handleLeave = (e) => {
        e.target.style.backgroundColor = 'transparent'
    }

    const handleClickWithdraw = (val) => {
        setShowWithdraw(true)
        setSelectVal(val)
    }

    const handleClickUnbonding = (val) => {
        setShowUnbonding(true)
        setSelectVal(val)
    }

    const handleClickRedelegate = (val) => {
        setShowRedelegate(true)
        setSelectVal(val)
    }

    const handleCloseWithdraw = () => {
        setShowWithdraw(false)
    }

    const handleCloseRedelegate = () => {
        setShowRedelegate(false)
    }

    const handleCloseUnbond = () => {
        setShowUnbonding(false)
    }

    return (
        <div>
            <div style={style.container}>
                <Title style={{ color: '#ED9D26', fontSize: '36px', fontWeight: 'bold', fontFamily: 'montserrat' }}>
                    Delegations
                </Title>
            </div>
            <div style={{ borderRadius: '10px', border: 'solid 2px #EEC13F', padding: '1em' }}>
                <div style={{ float: 'right', marginBottom: '1em' }}>
                    <Link to='/staking'>
                        <button style={style.button}>
                            Delegate
                        </button>
                    </Link>
                </div>
                {!loading ? (
                    <table cellPadding="0" cellSpacing="0" border="0" style={style.table}>
                        <thead style={style.tdlHeader}>
                            <tr>
                                <th style={{ ...style.th, width: '20%' }}>Validator</th>
                                <th style={{ ...style.th, width: '10rem', textAlign: 'left' }}>Token</th>
                                <th style={{ ...style.th, width: '10rem', textAlign: 'left' }}>Reward</th>
                                <th style={{ ...style.th, width: '10rem', textAlign: 'left' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody style={style.tdlContent}>
                            {rewards.map((reward, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={style.td}>
                                            {validators.filter(x => x.operator_address === reward.validator_address).length > 0 && validators.filter(x => x.operator_address === reward.validator_address)[0].description.moniker}
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'left' }}>
                                            {parseInt(delegations.filter(x => x.delegation.validator_address === reward.validator_address)[0].delegation.shares) / 1000000 || 0} DIG
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'left', }}>
                                            {reward.reward.length > 0 && parseInt(reward.reward[0].amount) / 1000000 || 0} DIG
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'left', width: '20%' }}>
                                            <Tooltip placement="top" title='Withdraw Reward'>
                                                <button onClick={() => handleClickWithdraw(index)}
                                                    style={{ ...style.actionButton, paddingLeft: '10px', borderRadius: '10px 0 0 10px', width: '20%' }}
                                                    onMouseEnter={handleOver}
                                                    onMouseLeave={handleLeave}>
                                                    <AiOutlineGift style={{ fontSize: '1.2rem' }} />
                                                </button>
                                            </Tooltip>
                                            <Tooltip placement="top" title='Redelegate'>
                                                <button onClick={() => handleClickRedelegate(index)}
                                                    style={{ ...style.actionButton, width: '20%' }}
                                                    onMouseEnter={handleOver}
                                                    onMouseLeave={handleLeave}>
                                                    <TiArrowRepeat style={{ fontSize: '1.2rem' }} />
                                                </button>
                                            </Tooltip>
                                            <Tooltip placement="top" title='Unbonding'>
                                                <button onClick={() => handleClickUnbonding(index)}
                                                    style={{ ...style.actionButton, paddingRight: '10px', borderRadius: '0 10px 10px 0', width: '20%' }}
                                                    onMouseEnter={handleOver}
                                                    onMouseLeave={handleLeave}>
                                                    <RiLogoutBoxRLine style={{ fontSize: '1.2rem' }} />
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                ) : (
                    <Skeleton active />
                )}
            </div>
            <Modal
                visible={showWithdraw}
                footer={null}
                closable={false}
                onCancel={handleCloseWithdraw}
            >
                <div style={{
                    color: '#EEC13F',
                    fontFamily: 'montserrat',
                    fontSize: '24px',
                    fontWeight: 400,
                }}>
                    <p>
                        Withdraw Rewards
                    </p>
                    <WithDrawModal
                        address={address}
                        type={type}
                        validator={rewards[selectVal] && rewards[selectVal].validator_address}
                        wrapSetShow={wrapSetShowWithdrawModal}
                    />
                </div>
            </Modal>
            <Modal
                visible={showRedelegate}
                footer={null}
                closable={false}
                onCancel={handleCloseRedelegate}
            >
                <div style={{
                    color: '#EEC13F',
                    fontFamily: 'montserrat',
                    fontSize: '24px',
                    fontWeight: 400,
                }}>
                    <p>
                        Redelegate Token
                    </p>
                    <ReDelegateModal
                        address={address}
                        type={type}
                        delegation={delegations[selectVal]}
                        wrapSetShow={wrapSetShowRedelegate}
                        validators={validators}
                    />
                </div>
            </Modal>
            <Modal
                visible={showUnbonding}
                footer={null}
                closable={false}
                onCancel={handleCloseUnbond}
            >
                <div style={{
                    color: '#EEC13F',
                    fontFamily: 'montserrat',
                    fontSize: '24px',
                    fontWeight: 400,
                }}>
                    <p>
                        Unbond Token
                    </p>
                    <UndelegateModal 
                        address={address}
                        type={type}
                        delegation={delegations[selectVal]}
                        wrapSetShow={wrapSetShowUnbondModal} 
                    />
                </div>
            </Modal>
        </div>
    )
}

export default DelegationList
