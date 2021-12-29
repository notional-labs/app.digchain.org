
import { Typography, } from 'antd';
import DelegateModal from './DelegateModal';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { getValidators } from '../helpers/getValidators';
import { getTotal } from '../helpers/getBalances';
import WithDrawModal from './WithDrawModal';

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
    actionButton: {
        border: 'solid 2px #3B2D52',
        backgroundColor: '#50426B',
        padding: 5,
        fontFamily: 'Ubuntu',
        fontSize: '1rem'
    },
    table: {
        width: '100%',
    },
    tdlHeader: {
        backgroundColor: '#3B2D52',
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
        color: '#fff',
        textTransform: 'uppercase',
        fontFamily: 'Ubuntu',
    },
    td: {
        padding: '15px',
        textAlign: 'left',
        verticalAlign: 'middle',
        fontWeight: '600',
        fontSize: '17px',
        color: '#fff',
        fontFamily: 'Ubuntu',
        width: '20%'
    }
}

const DelegationList = ({ address, type, delegations, rewards }) => {
    const [validators, setValidators] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectVal, setSelectVal] = useState(0)
    const [showWithdraw, setShowWithdraw] = useState(false)

    const wrapSetShowWithdrawModal = useCallback((val) => {
        setShowWithdraw(val)
    }, [setShowWithdraw])

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

    const handleClickWithdraw = (val) => {
        setShowWithdraw(true)
        setSelectVal(val)
    }

    const handleClose = () => {
        setShow(false)
    }

    return (
        <div style={{ padding: 20 }}>
            <div style={style.container}>
                <Title style={{ color: '#F6F3FB', fontSize: '2rem', fontWeight: 500, fontFamily: 'Ubuntu' }}>
                    Delegation
                </Title>
                <div style={{ width: '10%' }}>
                    <Link to='/staking' style={{ width: '30%' }}>
                        <button style={style.button}>
                            Delegate
                        </button>
                    </Link>
                </div>
            </div>
            {!loading && (
                <div>
                    <table cellPadding="0" cellSpacing="0" border="0" style={style.table}>
                        <thead style={style.tdlHeader}>
                            <tr>
                                <th style={{ ...style.th, width: '20%'}}>Validator</th>
                                <th style={{ ...style.th, width: '10rem', textAlign: 'right' }}>Token</th>
                                <th style={{ ...style.th, width: '10rem', textAlign: 'right' }}>Reward</th>
                                <th style={{ ...style.th, width: '10rem', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody style={style.tdlContent}>
                            {rewards.map((reward, index) => (
                                <tr style={{ backgroundColor: index % 2 !== 0 && '#9D91B5', borderBottom: 'solid 1px #bdbdbd' }}>
                                    <td style={style.td}>
                                        {validators.filter(x => x.operator_address === reward.validator_address)[0].description.moniker}
                                    </td>
                                    <td style={{...style.td, textAlign: 'right'}}>
                                        {parseInt(delegations.filter(x => x.delegation.validator_address === reward.validator_address)[0].delegation.shares) / 1000000} DIG
                                    </td>
                                    <td style={{...style.td, textAlign: 'right'}}>
                                        {parseInt(reward.reward[0].amount) / 1000000} DIG
                                    </td>
                                    <td style={{...style.td, textAlign: 'right'}}>
                                        <button onClick={() => handleClickWithdraw(index)} style={{...style.actionButton, paddingLeft: '10px', borderRadius: '10px 0 0 10px'}}>
                                            Withdraw Reward
                                        </button>
                                        <button style={style.actionButton}>
                                            Redelegate
                                        </button>
                                        <button style={{...style.actionButton, paddingRight: '10px', borderRadius: '0 10px 10px 0'}}>
                                            Unbonding
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <>
                <Modal show={showWithdraw} onHide={handleClose} backdrop="static" >
                    <Modal.Header style={{ backgroundColor: '#201A2B', color: '#F6F3FB', fontFamily: 'ubuntu', fontSize: '1.2rem', fontWeight: 600 }}>
                        <div>
                            Withdraw Rewards
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#604F80', }}>
                        <WithDrawModal address={address} type={type} validator={rewards[selectVal] && rewards[selectVal].validator_address} wrapSetShow={wrapSetShowWithdrawModal} />
                    </Modal.Body>
                </Modal>
            </>
        </div>
    )
}

export default DelegationList