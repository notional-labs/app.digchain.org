import { useEffect, useState, useCallback } from 'react';
import { Image } from 'antd';
import { getValidators, getLogo } from '../helpers/getValidators';
import { getTotal } from '../helpers/getBalances';
import "@fontsource/merriweather"
import PacmanLoader from "react-spinners/PacmanLoader";
import notFound from '../assets/img/no-profile.png'
import { Modal, } from 'react-bootstrap';
import DelegateModal from '../components/DelegateModal';
import { getKeplr, } from '../helpers/getKeplr';

const style = {
    table: {
        width: '90%',
        tableLayout: 'fixed',
    },
    tblHeader: {
        backgroundColor: '#3B2D52',
    },
    tblContent: {
        height: '300px',
        overflowX: 'auto',
        marginTop: '0px',
        borderRadius: '50px'
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
    }
}

const ValidatorsList = ({ account }) => {
    const [validators, setValidators] = useState([])
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [defaultVal, setDefaultVal] = useState(0)

    useEffect(() => {
        (async () => {
            setLoading(true)
            let vals = await getValidators()
            const totalSupply = getTotal(vals)
            vals = vals.sort((x, y) => y.delegator_shares - x.delegator_shares)
            vals.map((val) => {
                val.votingPowerPercentage = parseFloat(val.delegator_shares * 100 / totalSupply).toFixed(2)
            })
            setValidators([...vals])
            setLoading(false)
            console.log(vals)
        })()
    }, [])

    const wrapSetShow = useCallback((val) => {
        setShow(val)
    }, [setShow])

    const handleClick = async (index) => {
        if (!localStorage.getItem('accounts')) {
            const chain_id = localStorage.getItem('CHAIN_ID') || 'dig-1'
            const { accounts } = await getKeplr('dig-1')
            localStorage.setItem('accounts', JSON.stringify([accounts[0]]))
        }
        setDefaultVal(index)
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)
    }

    return (
        !loading ? (
            <div style={{ padding: 60, paddingLeft: 150, paddingRight: 100,}}>
                <div style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '3rem', color: '#EFCF20', fontFamily: 'Ubuntu', fontWeight: 600 }}>
                    Validators
                </div>
                <table cellPadding="0" cellSpacing="0" border="0" style={style.table}>
                    <thead style={style.tblHeader}>
                        <tr>
                            <th style={{ ...style.th, width: '5rem', borderRadius: '20px 0 0 0' }}>#</th>
                            <th style={{ ...style.th, width: '30rem', }}>Validator</th>
                            <th style={{ ...style.th, width: '25rem', textAlign: 'right' }}>Voting power</th>
                            <th style={{ ...style.th, width: '25rem', textAlign: 'right' }}>Commision</th>
                            <th style={{ ...style.th, width: '10rem', borderRight: 0, borderRadius: '0 20px 0 0' }}></th>
                        </tr>
                    </thead>
                    <tbody style={style.tblContent}>
                        {validators.map((val, index) => {
                            return (
                                <tr style={{ backgroundColor: index % 2 === 0 ? '#9D91B5' : '#867B97', borderBottom: index === validators.length - 1 ? 0 : 'solid 1px white' }}>
                                    <td style={{ ...style.td, borderRadius: index === validators.length - 1 && '0 0 0 20px' }}>{index + 1}</td>
                                    <td style={style.td}>
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>

                                            <Image
                                                width={40}
                                                src={val.logo || notFound}
                                                style={{ borderRadius: '100%', marginTop: '7px' }}
                                                preview={true}
                                            />

                                            <div style={{ marginLeft: '1rem' }} >
                                                <div style={{ color: '#2C223E', fontSize: '20px', fontWeight: 850 }}>{val.description.moniker}</div>
                                                <div style={{ fontSize: '12px', opacity: 0.6 }}>{val.description.website}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ ...style.td, textAlign: 'right', color: '#ededed' }}>
                                        <div>{`${parseInt(val.delegator_shares / 1000000)} DIG`}</div>
                                        <div style={{ fontSize: '14px', opacity: 0.6 }}>{`${val.votingPowerPercentage} %`} </div>
                                    </td>
                                    <td style={{ ...style.td, textAlign: 'right', color: '#e3e3e3' }}>{`${val.commission.commission_rates.rate * 100} %`}</td>
                                    <td style={{ ...style.td, textAlign: 'center', borderRadius: index === validators.length - 1 && '0 0 20px 0', }}>
                                        <button style={{
                                            backgroundColor: '#AC99CF',
                                            border: 'solid 1px #121016',
                                            borderRadius: '10px',
                                            width: '70%',
                                            padding: 8,
                                            fontSize: '15px',
                                            fontWeight: 600
                                        }} onClick={async() => await handleClick(index)}>
                                            Delegate
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Body >
                            <DelegateModal validators={validators} wrapSetter={wrapSetShow} defaultVal={defaultVal}/>
                        </Modal.Body>
                    </Modal>
                </>
            </div>
        ) : (
            <div style={{ marginRight: '10rem', paddingTop: '10rem' }}>
                <PacmanLoader color={'#473E56'} loading={loading} size={100} />
            </div>
        )
    )
}

export default ValidatorsList