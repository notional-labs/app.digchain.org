import { InputNumber, message, } from "antd"
import { unbonding } from "../helpers/transaction"
import { useEffect, useState } from 'react'
import { Form } from "react-bootstrap";
import { getKeplr, getStargateClient } from "../helpers/getKeplr";
import { makeSignDocBeginRedelegateMsg, makeBeginRedelegateMsg } from "../helpers/ethereum/lib/eth-transaction/Msg"
import { broadcastTransaction } from "../helpers/ethereum/lib/eth-broadcast/broadcastTX"
import { getWeb3Instance } from "../helpers/ethereum/lib/metamaskHelpers"
import { defaultRegistryTypes, StargateClient } from "@cosmjs/stargate";
import { Registry } from "@cosmjs/proto-signing"


//TODO: add logic to web, and right variale

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

const ReDelegateModal = ({ address, type, delegation, wrapSetShow, validators }) => {
    const [value, setValue] = useState('')
    const [selectVal, setSelectVal] = useState(0)

    const success = () => {
        message.success('Transaction sent', 1);
    };

    const error = () => {
        message.error('Redeleagate failed', 1);
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

    const handleChangeSelectVal = (e) => {
        setSelectVal(e.target.value)
    }

    const handleClick = async () => {
        if (type === 'keplr') {
            const { offlineSigner } = await getKeplr();

            const stargate = await getStargateClient(offlineSigner)
            if (stargate != null) {
                const amount = value * 1000000
                const val = delegation.delegation.validator_address
                const validator_src_address  = delegation.delegation.validator_address
                //TODO: add choice form to validator_dst_address
                const validator_dst_address = delegation.delegation.validator_address
                
                let stdFee = {
                    amount: [],
                    gas: gasLimit.toString(),
                }

                console.log("address")
                console.log(validator_src_address)
                console.log(validator_dst_address)

                const msgDelegate = makeBeginRedelegateMsg(address, validator_src_address, validator_dst_address, amount, denom)

                stargate.signAndBroadcast(address, msgDelegate, stdFee)              
            }
        }
        else {
            //makeSignDocDelegateMsg, makeDelegateMsg
            // please set enviroment variable: DENOM, etc
            //import web3
            let web3 = await getWeb3Instance();
            const denom = process.env.REACT_APP_DENOM
            const chainId = "test-1"
            const memo = "Love From Notional's Dev Team"

            const gasLimit = 200000


            const validator_src_address  = delegation.delegation.validator_address
            //TODO: add choice form to validator_dst_address
            const validator_dst_address = delegation.delegation.validator_address
            const amount = value * 1000000

            console.log("address")
            console.log(validator_src_address)
            console.log(validator_dst_address)

            const msgDelegate = makeBeginRedelegateMsg(address, validator_src_address, validator_dst_address, amount, denom)
            const signDocDelegate = makeSignDocBeginRedelegateMsg(address, validator_src_address, validator_dst_address, amount, denom)

            console.log(msgDelegate)
            console.log(signDocDelegate)

            var err = await broadcastTransaction(address, msgDelegate, signDocDelegate, chainId, memo, gasLimit, web3)

           
        }
    }

    return (
        <div>
            <div style={style.transfer}>
                <p style={style.formTitle}>Delegator</p>
                <div style={{
                    marginBottom: '20px',
                    width: '100%',
                    height: '40px',
                    borderRadius: '10px',
                    border: `2px solid #c4c4c4`,
                    fontSize: '1rem',
                    padding: '0.2rem',
                    paddingLeft: '0.5rem',
                    backgroundColor: '#403455',
                    color: '#F6F3FB'
                }}>
                    {address}
                </div>
                <p style={style.formTitle}>Validator</p>
                <div style={{
                    marginBottom: '20px',
                    width: '100%',
                    height: '40px',
                    borderRadius: '10px',
                    border: `2px solid #c4c4c4`,
                    fontSize: '1rem',
                    padding: '0.2rem',
                    paddingLeft: '0.5rem',
                    backgroundColor: '#403455',
                    color: '#F6F3FB'
                }}>
                    {delegation.delegation.validator_address}
                </div>
            </div>
            <div style={style.transfer}>
                <p style={style.formTitle}>To</p>
                <>
                    <Form.Select onChange={handleChangeSelectVal} style={style.formInput}>
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
                    }} min={0} max={parseFloat(delegation.delegation.shares)/1000000} step={0.000001} onChange={handleChange} />
                </>
            </div>
            <div style={style.button}>
                <button onClick={() => wrapSetShow(false)} style={{ border: 0, borderRadius: '10px', width: '20%', height: '2.5rem', fontSize: '1rem', backgroundColor: '#838089', color: '#F6F3FB', fontFamily: 'ubuntu', marginRight: '20px' }}>
                    Cancel
                </button>
                <button disabled={checkDisable()} onClick={handleClick} style={{ border: 0, borderRadius: '10px', width: '20%', height: '2.5rem', fontSize: '1rem', backgroundColor: '#AC99CF', color: '#F6F3FB', fontFamily: 'ubuntu' }}>
                    Send
                </button>
            </div>
        </div>
    )
}

export default ReDelegateModal