import { useEffect, useState, useCallback } from 'react';
import { Image, Breadcrumb } from 'antd';
import { getValidators, getLogo } from '../helpers/getValidators';
import { getTotal } from '../helpers/getBalances';
import "@fontsource/merriweather"
import PacmanLoader from "react-spinners/PacmanLoader";
import notFound from '../assets/img/no-profile.png'
import { Modal, } from 'react-bootstrap';
import DelegateModal from '../components/DelegateModal';
import { getKeplr, } from '../helpers/getKeplr';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'

const style = {
    table: {
        width: '100%',
        borderSpacing: '0 1em',
        borderCollapse: 'separate'
    },
    tblHeader: {
        backgroundColor: 'transparent',
    },
    tblContent: {
        borderRadius: '50px',
    },
    th: {
        padding: '15px 15px',
        textAlign: 'left',
        fontWeight: '700',
        fontSize: '1.3rem',
        color: '#fff',
        textTransform: 'uppercase',
        fontFamily: 'Ubuntu',
    },
    td: {
        padding: '1em',
        textAlign: 'left',
        verticalAlign: 'middle',
        fontWeight: '600',
        fontSize: '17px',
        color: '#696969',
        fontFamily: 'Ubuntu',
    }
}

const ValidatorsList = () => {
    const [validators, setValidators] = useState([])
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [defaultVal, setDefaultVal] = useState(0)
    const [setLogo, setSetLogo] = useState(false)
    const [state, setState] = useState('desc')

    useEffect(() => {
        (async () => {
            setLoading(true)
            setSetLogo(false)
            let vals = await getValidators(true)
            const totalSupply = getTotal(vals)
            vals = vals.sort((x, y) => y.delegator_shares - x.delegator_shares)
            vals.map((val) => {
                val.votingPowerPercentage = parseFloat(val.delegator_shares * 100 / totalSupply).toFixed(2)
            })
            let promises = []
            vals.forEach(val => {
                promises.push(getLogo(val.description.identity))
            })
            Promise.all(promises).then((logos) => {
                vals.map((val, index) => val.logo = logos[index])
                setSetLogo(true)
            })
            setValidators([...vals])
            setLoading(false)
        })()
    }, [])

    const wrapSetShow = useCallback((val) => {
        setShow(val)
    }, [setShow])

    const handleClick = async (index) => {
        if (!localStorage.getItem('accounts')) {
            const { accounts } = await getKeplr('dig-1')
            localStorage.setItem('accounts', JSON.stringify([{ account: accounts[0], type: 'keplr' }]))
        }
        setDefaultVal(index)
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)
    }

    const handleOver = (e) => {
        e.target.style.backgroundColor = 'rgb(242, 242, 242, 0.7)'
    }

    const handleLeave = (e) => {
        e.target.style.backgroundColor = 'transparent'
    }


    const handleSort = () => {
        if (state === 'desc') {
            setState('asc')
            setValidators([...validators.sort((x, y) => x.delegator_shares - y.delegator_shares)])
        }
        else {
            setState('desc')
            setValidators([...validators.sort((x, y) => y.delegator_shares - x.delegator_shares)])
        }
    }

    return (
        !loading ? (
            <div style={{ padding: 60 }}>
                <div style={{ textAlign: 'left', fontSize: '3rem', color: '#EFCF20', fontFamily: 'Ubuntu', fontWeight: 600 }}>
                    Validators
                </div>
                <div style={{
                    backgroundColor: 'rgb(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: 10,
                    paddingLeft: 70,
                    paddingRight: 70,
                    paddingBottom: 70
                }}>
                    <table cellSpacing={100000000} style={style.table}>
                        <thead style={style.tblHeader}>
                            <tr>
                                <th style={{ ...style.th, width: '30rem' }}>Validator</th>
                                <th style={{ ...style.th, width: '25rem', textAlign: 'right' }}>
                                    <button style={{
                                        backgroundColor: 'transparent',
                                        border: 0,
                                        fontWeight: '700',
                                        fontSize: '1.3rem',
                                        color: '#fff',
                                        textTransform: 'uppercase',
                                        fontFamily: 'Ubuntu',
                                        padding: 10,
                                        borderRadius: '20px'
                                    }} onMouseEnter={handleOver}
                                        onMouseLeave={handleLeave}
                                        onClick={handleSort}>
                                        Voting power
                                        {state === 'desc' ? <CaretDownOutlined /> : <CaretUpOutlined />}
                                    </button>
                                </th>
                                <th style={{ ...style.th, width: '25rem', textAlign: 'right' }}>Commision</th>
                                <th style={{ ...style.th, width: '10rem', borderRight: 0, textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody style={style.tblContent}>
                            {validators.map((val, index) => {
                                return (
                                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff5e8' : '#fff5e8', marginBottom: 20 }}>
                                        <td style={{ ...style.td, borderRadius: '60px 0 0 60px', }}>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                {
                                                    setLogo ? (
                                                        <Image
                                                            width={50}
                                                            src={val.logo || notFound}
                                                            style={{ borderRadius: '100%', marginTop: '3px' }}
                                                            preview={true}
                                                        />

                                                    ) : (
                                                        <Image
                                                            width={50}
                                                            src={notFound}
                                                            style={{ borderRadius: '100%', marginTop: '3px' }}
                                                            preview={true}
                                                        />
                                                    )
                                                }

                                                <div style={{ marginLeft: '1rem' }} >
                                                    <div style={{ color: '#2C223E', fontSize: '20px', fontWeight: 850 }}>{val.description.moniker}</div>
                                                    <div style={{ fontSize: '12px', opacity: 0.6, color: '#696969' }}>{val.description.website ? val.description.website : val.description.identity}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'right', color: '#696969' }}>
                                            <div>{`${parseInt(val.delegator_shares / 1000000)} DIG`}</div>
                                            <div style={{ fontSize: '14px', opacity: 0.6 }}>{`${val.votingPowerPercentage} %`} </div>
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'right', color: '#696969' }}>{`${val.commission.commission_rates.rate * 100} %`}</td>
                                        <td style={{ ...style.td, textAlign: 'center', borderRadius: '0 60px 60px 0', color: '#ffffff' }}>
                                            <button style={{
                                                backgroundColor: '#ffac38',
                                                border: 'solid 2px #121016',
                                                borderRadius: '50px',
                                                width: '80%',
                                                padding: '1em',
                                                fontSize: '15px',
                                                fontWeight: 600
                                            }} onClick={async () => await handleClick(index)}>
                                                Delegate
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <>
                    <Modal show={show} onHide={handleClose} backdrop="static" >
                        <Modal.Header style={{ backgroundColor: '#d6d6d6', color: '#696969', fontFamily: 'ubuntu', fontSize: '1.2rem', fontWeight: 600 }}>
                            <div>
                                Delegate Token
                            </div>
                        </Modal.Header>
                        <Modal.Body style={{ backgroundColor: '#1f1f1f', }}>
                            <DelegateModal validators={validators} wrapSetter={wrapSetShow} defaultVal={defaultVal} />
                        </Modal.Body>
                    </Modal>
                </>
            </div>
        ) : (
            <div style={{ marginRight: '10rem', paddingTop: '10rem', height: '77vh' }}>
                <PacmanLoader color={'#f0a848'} loading={loading} size={100} />
            </div>
        )
    )
}

export default ValidatorsList