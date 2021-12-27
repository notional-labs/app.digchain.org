import { InputNumber, message, } from "antd"
import { delegate } from "../helpers/transaction"
import { useEffect, useState } from 'react'
import { Form } from "react-bootstrap";
import { getKeplr, getStargateClient } from "../helpers/getKeplr";
import { makeSignDocWithDrawMsg, makeWithDrawMsg } from "../helpers/ethereum/lib/eth-transaction/Msg"
import { broadcastTransaction } from "../helpers/ethereum/lib/eth-broadcast/broadcastTX"

const style = {
    transfer: {
        marginBottom: '2rem',
        width: '100%',
        marginTop: '1rem',
        padding: 20,
        backgroundColor: '#604F80',
        borderRadius: '20px',
        border: 'solid 1px #bdbdbd'
    },
    transferInfo: {
        padding: '50px',
        borderRadius: '10px',
        width: '20rem'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        marginTop: '2rem',
        marginBottom: '1rem'
    },
    formInput: {
        backgroundColor: '#403455',
        color: '#bdbdbd',
        borderRadius: '10px',
    },
    formTitle: {
        fontFamily: 'ubuntu',
        color: '#bdbdbd',
        fontWeight: 500
    }
}

const WithDrawModel = ({ validators, wrapSetter, defaultVal }) => {
    const [value, setValue] = useState('')
    const [delegators, setDelegators] = useState([])
    const [selectVal, setSelectVal] = useState(defaultVal)
    const [selectDel, setSelectDel] = useState(0)

    useEffect(() => {
        (async () => {
            setDelegators([...JSON.parse(localStorage.getItem('accounts'))])
        })()
    }, [])

    const success = () => {
        message.success('Deposit success', 1);
    };

    const error = () => {
        message.error('Deposit failed maybe your account does not have dig yet', 2);
    };

    const handleChange = (value) => {
        setValue(value)
    }

    const checkDisable = () => {
        if (value === 0) {
            return true
        }
        return false
    }

    const handleChangeSelect = (e) => {
        setSelectDel(e.target.value)
    }

    const handleChangeSelectVal = (e) => {
        setSelectVal(e.target.value)
    }

    const handleClick = async () => {
        if (delegators[selectDel].type === 'keplr') {
            const { offlineSigner } = await getKeplr();

            const stargate = await getStargateClient(offlineSigner)
            if (stargate != null) {
                const amount = value * 1000000
                const recipient = validators[selectVal].operator_address
                withDrawal(stargate, delegators[selectDel].account.address, amount, recipient).then(data => {
                    success()
                    wrapSetter(false)
                }).catch((e) => {
                    error()
                    wrapSetter(false)
                    console.log(e)
                })
            }
        }
        else{
            //makeSignDocDelegateMsg, makeDelegateMsgmakeDelegateMsg
            // please set enviroment variable: DENOM, etc
            //import web3
            let web3 = await getWeb3Instance();
            const denom = "stake"
            const chainId = "test-1"
            const memo = "Love From Dev Team"

            const address = delegators[selectDel].account
            const gasLimit = 200000


            const recipient = validators[selectVal].operator_address
            const amount = value * 1000000

            const msgWithDraw = makeWithDrawMsg(address, recipient, amount, denom) 
            const makeSignDocWithDrawelMsg = makeSignDocWithDrawMsg(delegators[selectDel].account, recipient, amount, denom) 
            
            broadcastTransaction(address, msgWithDraw, makeSignDocWithDrawelMsg, chainId, memo, gasLimit, web3 )
        }
    }

    return (
        <div>
            <div style={style.transfer}>
                <p style={style.formTitle}>Delegator</p>
                <>
                    <Form.Select onChange={handleChangeSelect} defaultValue={selectDel} style={style.formInput}>
                        {
                            delegators.map((delegator, index) => (
                                <option value={index}>{delegator.account.address}</option>
                            ))
                        }
                    </Form.Select>
                </>
            </div>
            <div style={style.transfer}>
                <p style={style.formTitle}>Valadator</p>
                <>
                    <Form.Select onChange={handleChangeSelectVal} defaultValue={selectVal} style={style.formInput}>
                        {
                            validators.map((val, index) => (
                                <option value={index}>{val.description.moniker} ({`${val.commission.commission_rates.rate * 100}%`})</option>
                            ))
                        }
                    </Form.Select>
                </>
            </div>
            <div style={style.transfer}>
                <div style={{ marginBottom: '1rem', ...style.formTitle }}>Amount To Stake</div>
                <>
                    <InputNumber style={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '10px',
                        border: `2px solid #c4c4c4`,
                        fontSize: '1rem',
                        paddingTop: '0.2rem',
                        backgroundColor: '#403455',
                        color: '#F6F3FB'
                    }} min={0} step={0.000001} onChange={handleChange} />
                </>
            </div>
            <div style={style.button}>
                <button disabled={checkDisable()} onClick={() => wrapSetter(false)} style={{ border: 0, borderRadius: '10px', width: '20%', height: '2.5rem', fontSize: '1rem', backgroundColor: '#838089', color: '#F6F3FB', fontFamily: 'ubuntu', marginRight: '20px' }}>
                    Cancel
                </button>
                <button disabled={checkDisable()} onClick={handleClick} style={{ border: 0, borderRadius: '10px', width: '20%', height: '2.5rem', fontSize: '1rem', backgroundColor: '#AC99CF', color: '#F6F3FB', fontFamily: 'ubuntu' }}>
                    Send
                </button>
            </div>
        </div>
    )
}

export default DelegateModal