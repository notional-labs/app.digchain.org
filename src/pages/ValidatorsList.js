import { useEffect, useState, useCallback } from 'react';
import { Image, } from 'antd';
import { getValidators, getLogo } from '../helpers/getValidators';
import { getTotal } from '../helpers/getBalances';
import "@fontsource/montserrat"
import PacmanLoader from "react-spinners/PacmanLoader";
import notFound from '../assets/img/no-profile.png'
import { Modal, } from 'react-bootstrap';
import DelegateModal from '../components/DelegateModal';
import { getKeplr, } from '../helpers/getKeplr';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import helmet from '../assets/img/Grouphelmet.png'

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
        padding: '10px 10px',
        textAlign: 'left',
        fontWeight: 900,
        fontSize: '24px',
        color: '#EEC13F',
        textTransform: 'uppercase',
        fontFamily: 'montserrat',
    },
    td: {
        padding: '0.7em',
        paddingLeft: '1em',
        paddingRight: '1em',
        textAlign: 'left',
        verticalAlign: 'middle',
        fontWeight: 700,
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'montserrat',
    },
    breadcrumb: {
        textAlign: 'left',
        fontWeight: 700,
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'montserrat',
        paddingBottom: '0.5em'
    },
}

const ValidatorsList = () => {
    const [validators, setValidators] = useState([])
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [defaultVal, setDefaultVal] = useState(0)
    const [setLogo, setSetLogo] = useState(false)
    const [state, setState] = useState('')
    const [logos, setLogos] = useState([])

    useEffect(() => {
        (async () => {
            setLoading(true)
            setSetLogo(false)
            let vals = await getValidators(true)
            const totalSupply = getTotal(vals)
            let bogo1 = vals.filter(x => x.operator_address === 'digvaloper12hjc5e9z3c4x8hl8yyxlqfx67wr89meaas6k7z')[0]
            let bogo2 = vals.filter(x => x.operator_address === 'digvaloper1cxu3telmqz2we6s8xy4xckr8sl2n7judqdq629')[0]
            let bogo3 = vals.filter(x => x.operator_address === 'digvaloper1lu3at7mda24anr9eecdhyt9wsq8dwhrn664y4z')[0]
            vals = vals.filter(x => x.operator_address !== 'digvaloper12hjc5e9z3c4x8hl8yyxlqfx67wr89meaas6k7z'
                && x.operator_address !== 'digvaloper1cxu3telmqz2we6s8xy4xckr8sl2n7judqdq629'
                && x.operator_address !== 'digvaloper1lu3at7mda24anr9eecdhyt9wsq8dwhrn664y4z')
            vals.unshift(bogo2, bogo3, bogo1)
            vals = vals.filter(x => x)
            if (vals.length > 0) {
                vals.map( async (val) => {
                    val.votingPowerPercentage = parseFloat(val.delegator_shares * 100 / totalSupply).toFixed(2)
                    const img = await getLogo(val.description.identity)
                        if (img) {
                            setLogos([...img])
                            val.logo = img
                        }
                        else {
                            val.logo = notFound
                        }
                    })
            }
            // let promises = []
            // vals.forEach(val => {
            //     promises.push(getLogo(val.description.identity))
            // })
            // Promise.all(promises).then((logos) => {
            //     vals.map((val, index) => {
            //         if (logos[index]) {
            //             val.logo = logos[index]
            //         }
            //         else {
            //             val.logo = notFound
            //         }
            //     })
            //     setSetLogo(true)
            // })
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
        else if (state === 'asc') {
            setState('desc')
            setValidators([...validators.sort((x, y) => y.delegator_shares - x.delegator_shares)])
        }
        else {
            setState('desc')
            setValidators([...validators.sort((x, y) => y.delegator_shares - x.delegator_shares)])
        }
    }

    return (
        !loading ? (
            <div style={{ padding: 70, paddingTop: '7em' }}>
                <div style={{
                    textAlign: 'left',
                    fontSize: '36px',
                    color: '#ffffff',
                    fontFamily: 'montserrat',
                    fontWeight: 'bold',
                    marginBottom: '20px'
                }}>
                    VALIDATOR
                </div>
                <div>
                    <table style={style.table}>
                        <thead style={style.tblHeader}>
                            <tr>
                                <th style={{ ...style.th, width: '40%' }}>Validator</th>
                                <th style={{ ...style.th, width: '20%', textAlign: 'center' }}>
                                    <button style={{
                                        backgroundColor: 'transparent',
                                        border: 0,
                                        textTransform: 'uppercase',
                                        fontFamily: 'montserrat',
                                        fontWeight: 'bold',
                                        padding: 10,
                                        borderRadius: '24px'
                                    }} onMouseEnter={handleOver}
                                        onMouseLeave={handleLeave}
                                        onClick={handleSort}>
                                        Voting power
                                        {state === 'desc' ? <CaretDownOutlined /> : state === 'asc' && <CaretUpOutlined />}
                                    </button>
                                </th>
                                <th style={{ ...style.th, width: '20%', textAlign: 'center' }}>Commision</th>
                                <th style={{ ...style.th, width: '20%', borderRight: 0, textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody style={style.tblContent}>
                            {validators.map((val, index) => {
                                return (
                                    <tr key={index} style={{ backgroundColor: 'transparent', marginBottom: 20, }}>
                                        <td style={{ ...style.td, borderRadius: '10px 0 0 10px', border: 'solid 2px #ED9D26', borderRight: 'none' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <div style={{
                                                    borderRadius: '50%',
                                                    backgroundImage: `url(${val.logo})` || `url(${notFound})`,
                                                    backgroundSize: 'cover',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center',
                                                    width: '55px',
                                                }}>
                                                    <Image
                                                        width={45}
                                                        src={helmet}
                                                        style={{
                                                            borderRadius: '100%',
                                                            textAlign: 'left',
                                                            position: 'relative',
                                                            marginTop: '-70%',
                                                            marginLeft: '-30%'
                                                        }}
                                                        preview={false}
                                                    />
                                                </div>
                                                {/* {
                                                    setLogo ? (
                                                        <Image
                                                            width={70}
                                                            src={val.logo || notFound}
                                                            style={{
                                                                borderRadius: '100%', marginTop: '3px', position: 'relative',
                                                                zIndex: '2'
                                                            }}
                                                            preview={true}
                                                        />

                                                    ) : (
                                                        <Image
                                                            width={70}
                                                            src={notFound}
                                                            style={{
                                                                borderRadius: '100%', marginTop: '3px', position: 'relative',
                                                                zIndex: '2'
                                                            }}
                                                            preview={true}
                                                        />
                                                    )
                                                } */}

                                                <div style={{ marginLeft: '1rem' }} >
                                                    <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>{val.description.moniker}</div>
                                                    <div style={{ fontSize: '15px', fontWeight: 400, opacity: 0.6 }}>{val.description.website ? val.description.website : val.description.identity}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'center', border: 'solid 2px #ED9D26', borderRight: 'none', borderLeft: 'none' }}>
                                            <div>{`${parseInt(val.delegator_shares / 1000000)} DIG`}</div>
                                            <div style={{ fontSize: '15px', opacity: 0.6 }}>{`${val.votingPowerPercentage} %`} </div>
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'center', border: 'solid 2px #ED9D26', borderRight: 'none', borderLeft: 'none' }}>{`${val.commission.commission_rates.rate * 100} %`}</td>
                                        <td style={{ ...style.td, textAlign: 'center', borderRadius: '0 10px 10px 0', border: 'solid 2px #ED9D26', borderLeft: 'none', color: '#ffffff' }}>
                                            <button style={{
                                                backgroundColor: '#ED9D27',
                                                border: 'none',
                                                borderRadius: '10px',
                                                padding: '1em',
                                                fontSize: '15px',
                                                fontWeight: 700,
                                                boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.25)'
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
                        <Modal.Header style={{
                            backgroundColor: '#4D4D4D',
                            color: '#EEC13F',
                            fontFamily: 'montserrat',
                            fontSize: '20px',
                            fontWeight: 400,
                            border: 0
                        }}>
                            <div>
                                Delegate Token
                            </div>
                        </Modal.Header>
                        <Modal.Body style={{ backgroundColor: '#4D4D4D', }}>
                            <DelegateModal validators={validators} wrapSetter={wrapSetShow} defaultVal={defaultVal} />
                        </Modal.Body>
                    </Modal>
                </>
            </div >
        ) : (
            <div style={{ marginRight: '10rem', paddingTop: '10rem', height: '77vh' }}>
                <PacmanLoader color={'#f0a848'} loading={loading} size={100} />
            </div>
        )
    )
}

export default ValidatorsList
