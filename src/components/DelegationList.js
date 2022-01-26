
import { Typography, Tooltip } from 'antd';
import { Modal } from 'react-bootstrap';
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
        padding: 20,
        paddingTop: 0,
        paddingBottom: 20
    },
    button: {
        border: 0,
        borderRadius: '50px',
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
    actionButton: {
        border: 'solid 2px #3B2D52',
        backgroundColor: 'transparent',
        padding: 5,
        fontFamily: 'Ubuntu',
        fontSize: '1rem'
    },
    table: {
        width: '100%',
    },
    tdlHeader: {
        backgroundColor: '#ffa538',
    },
    tdlContent: {
        marginTop: '0px',
        borderRadius: '50px',
        paddingTop: 0
    },
    th: {
        padding: '15px 15px',
        textAlign: 'left',
        fontWeight: '700',
        fontSize: '15px',
        color: '#ffffff',
        textTransform: 'uppercase',
        fontFamily: 'Ubuntu',
    },
    td: {
        padding: '15px',
        textAlign: 'left',
        verticalAlign: 'middle',
        fontWeight: '600',
        fontSize: '17px',
        color: '#696969',
        fontFamily: 'Ubuntu',
        width: '20%'
    }
}

const DelegationList = ({ address, type, delegations, rewards, wrapSetPage }) => {
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
        setShowWithdraw(false)
    }

    const handleCloseUnbond = () => {
        setShowUnbonding(false)
    }

    return (
        <div style={{ padding: 20 }}>
            <div style={style.container}>
                <Title style={{ color: '#F6F3FB', fontSize: '2rem', fontWeight: 500, fontFamily: 'Ubuntu' }}>
                    Delegations
                </Title>
                <div style={{ width: '10%' }}>
                    <Link to='/staking' style={{ width: '30%' }}>
                        <button style={style.button} onClick={() => {
                            wrapSetPage('staking')
                        }}>
                            Delegate
                        </button>
                    </Link>
                </div>
            </div>
            {!loading && (
                <div style={{backgroundColor: 'rgb(255, 255, 255, 1)', borderRadius: '20px', padding: '2em'}}>
                    <table cellPadding="0" cellSpacing="0" border="0" style={style.table}>
                        <thead style={style.tdlHeader}>
                            <tr>
                                <th style={{ ...style.th, width: '20%' }}>Validator</th>
                                <th style={{ ...style.th, width: '10rem', textAlign: 'right' }}>Token</th>
                                <th style={{ ...style.th, width: '10rem', textAlign: 'right' }}>Reward</th>
                                <th style={{ ...style.th, width: '10rem', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody style={style.tdlContent}>
                            {rewards.map((reward, index) => {
                                return (
                                <tr key={index} style={{ backgroundColor: index % 2 !== 0 && '#d4ffc7', borderBottom: 'solid 1px #7d7d7d' }}>
                                    <td style={style.td}>
                                        {validators.filter(x => x.operator_address === reward.validator_address).length > 0 && validators.filter(x => x.operator_address === reward.validator_address)[0].description.moniker}
                                    </td>
                                    <td style={{ ...style.td, textAlign: 'right' }}>
                                        {delegations.filter(x => x.delegation.validator_address === reward.validator_address).length > 0 && 
                                            parseInt(delegations.filter(x => x.delegation.validator_address === reward.validator_address)[0].delegation.shares) / 1000000 || 0} DIG
                                    </td>
                                    <td style={{ ...style.td, textAlign: 'right', }}>
                                        {reward.reward.length > 0 && parseInt(reward.reward[0].amount) / 1000000 || 0} DIG
                                    </td>
                                    <td style={{ ...style.td, textAlign: 'center', width: '20%' }}>
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
                            )})}
                        </tbody>
                    </table>
                </div>
            )}
            <>
                <Modal show={showWithdraw} onHide={handleCloseWithdraw} backdrop="static" >
                    <Modal.Header style={{ backgroundColor: '#d6d6d6', color: '#696969', fontFamily: 'ubuntu', fontSize: '1.2rem', fontWeight: 600 }}>
                        <div>
                            Withdraw Rewards
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#1f1f1f', }}>
                        <WithDrawModal address={address}
                            type={type}
                            validator={rewards[selectVal] && rewards[selectVal].validator_address}
                            wrapSetShow={wrapSetShowWithdrawModal} />
                    </Modal.Body>
                </Modal>
            </>
            <>
                <Modal show={showRedelegate} onHide={handleCloseRedelegate} backdrop="static" >
                    <Modal.Header style={{ backgroundColor: '#d6d6d6', color: '#696969', fontFamily: 'ubuntu', fontSize: '1.2rem', fontWeight: 600 }}>
                        <div>
                            Redelegate Token
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#1f1f1f', }}>
                        <ReDelegateModal address={address}
                            type={type}
                            delegation={delegations[selectVal]}
                            wrapSetShow={wrapSetShowRedelegate}
                            validators={validators} />
                    </Modal.Body>
                </Modal>
            </>
            <>
                <Modal show={showUnbonding} onHide={handleCloseUnbond} backdrop="static" >
                    <Modal.Header style={{ backgroundColor: '#d6d6d6', color: '#696969', fontFamily: 'ubuntu', fontSize: '1.2rem', fontWeight: 600 }}>
                        <div>
                            Unbond Token
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#1f1f1f', }}>
                        <UndelegateModal address={address}
                            type={type}
                            delegation={delegations[selectVal]}
                            wrapSetShow={wrapSetShowUnbondModal} />
                    </Modal.Body>
                </Modal>
            </>
        </div>
    )
}

export default DelegationList
