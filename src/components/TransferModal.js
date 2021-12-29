import { Input, InputNumber, message, } from "antd"
import { transfer } from "../helpers/transaction"
import { useEffect, useState } from 'react'
import { getBalance } from "../helpers/getBalances";
import { getKeplr, getStargateClient } from "../helpers/getKeplr";

import { makeSendMsg, makeSignDocSendMsg, } from "../helpers/ethereum/lib/eth-transaction/Msg"
import { broadcastTransaction } from "../helpers/ethereum/lib/eth-broadcast/broadcastTX"
import { getWeb3Instance } from "../helpers/ethereum/lib/metamaskHelpers";

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

const TransferModal = ({ account, wrapSetShow }) => {
    const [value, setValue] = useState('')
    const [address, setAddress] = useState('')
    const [amount, setAmount] = useState('')

    useEffect(() => {
        (async () => {
            if (account.type === 'keplr') {
                const balance = await getBalance(account.account.address)
                const balanceAmount = balance.length > 0 ? balance[0][0].amount : 0

                setAmount(balanceAmount)
            }
            else {
                const balance = await getBalance(account.account)
                const balanceAmount = balance.length > 0 ? balance[0][0].amount : 0

                setAmount(balanceAmount)
            }
        })()
    }, [account])

    const success = () => {
        message.success('Deposit success', 1);
    };

    const error = () => {
        message.error('Deposit failed', 2);
    };

    const handleChange = (value) => {
        setValue(value)
    }

    const handleChangeAddress = (e) => {
        setAddress(e.target.value)
    }

    const checkDisable = () => {
        if (value === 0 || address === '') {
            return true
        }
        return false
    }

    const handleClick = async () => {
        if (account.type === 'keplr') {
            const { offlineSigner } = await getKeplr();

            const stargate = await getStargateClient(offlineSigner)
            if (stargate != null) {
                const amount = value * 1000000
                const recipient = address
                transfer(stargate, account.account.address, amount, recipient).then(() => {
                    success()
                    wrapSetShow(false)
                }).catch((e) => {
                    error()
                    wrapSetShow(false)
                    console.log(e)
                })
            }
        }
        else {
            let web3 = await getWeb3Instance();
            const denom = "stake"
            const chainId = "test-1"
            const memo = "Love From Dev Team"

            const gasLimit = 200000

            const amount = value * 1000000

            const msgDelegate = makeSendMsg(account.account, address, amount, denom) 
            const signDocDelegate = makeSignDocSendMsg(account.account, address, amount, denom) 

            console.log("address", address)
            console.log("address abc", account.account)

            const result = await broadcastTransaction(account.account, msgDelegate, signDocDelegate, chainId, memo, gasLimit, web3 )
            console.log("fuck shiut", result)
        }
    }

    return (
        <div>
            <div style={style.transfer}>
                <p style={style.formTitle}>From</p>
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
                    {account.type === 'keplr' ? account.account.address : account.account}
                </div>
                <p style={style.formTitle}>To</p>
                <>
                    <Input style={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '10px',
                        border: `2px solid #c4c4c4`,
                        fontSize: '1rem',
                        paddingTop: '0.2rem',
                        backgroundColor: '#403455',
                        color: '#F6F3FB'
                    }}
                        placeholder="Recipient address"
                        onChange={handleChangeAddress} />
                </>
            </div>
            <div style={style.transfer}>
                <div style={{ marginBottom: '1rem', ...style.formTitle }}>Amount To Send</div>
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
                    }} min={0} max={parseInt(amount) / 1000000} step={0.000001} onChange={handleChange} />
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

export default TransferModal