import { Typography, } from 'antd';
import "@fontsource/merriweather"
import { getBalance } from '../helpers/getBalances';
import { useEffect, useState } from 'react';
import {
    Link,
} from "react-router-dom";


const { Title, Paragraph } = Typography;

const style = {
    container: {
        backgroundColor: '#f4d257',
        padding: 24,
        borderRadius: '10px',
        border: 'solid 1px black',
        width: '50%',
        height: '40%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    div: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    button: {
        border: 0,
        borderRadius: '10px',
        width: '30%',
        height: '40px',
        marginTop: 10,
        marginBottom: 10,
        fontFamily: 'ubuntu',
        fontWeight: 600
    },
    buttonDiv: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
}

const ProfileCard = ({ account, index, wrapSetSelect, wrapSetShow, wrapSetAccounts }) => {
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

    const handleClick = () => {
        wrapSetSelect(index)
        wrapSetShow(true)
    }

    const handleRemove = () => {
        const accounts = JSON.parse(localStorage.getItem('accounts'))
        const filterAccouts = accounts.filter(x => x.type === 'keplr' && x.account.address !== account.account.address || x.type === 'metamask' && x.account !== account.account )
        localStorage.setItem('accounts', JSON.stringify([...filterAccouts]))
        wrapSetAccounts(filterAccouts)
    }

    return (
        <div style={style.container}>
            <Paragraph copyable={{ text: account.type === 'keplr' ? account.account.address && account.account.address.trim() : account.account && account.account.trim()}}
                style={{
                    color: '#2a3158',
                    fontFamily: 'Merriweather',
                    textAlign: 'left',
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: '20px'
                }}>
                {account.type === 'keplr' ? (account.account.address.length > 100 ? `${account.account.address.substring(0, 100)}... ` : `${account.account.address} `) : (account.account.length > 100 ? `${account.account.substring(0, 100)}... ` : `${account.account} `)}
            </Paragraph>
            <Paragraph style={{
                color: '#2a3158',
                fontFamily: 'Merriweather',
                textAlign: 'left',
                backgroundColor: 'white',
                padding: 20,
                borderRadius: '20px'
            }}>
                {parseFloat(amount) / 1000000 || 0} DIG
            </Paragraph>
            <div style={style.buttonDiv}>
                <button style={{ ...style.button, backgroundColor: '#ff9f40', color: '#F6F3FB' }} onClick={handleClick}>
                    Transfer
                </button>
                <Link style={{width: '30%'}} to={account.type === 'keplr' ? account.account.address : account.account}>
                    <button style={{ ...style.button, width: '100%', backgroundColor: '#ff9f40', color: '#F6F3FB' }}>
                        Detail
                    </button>
                </Link>
                <button style={{ ...style.button, backgroundColor: '#ff4a4a', color: '#F6F3FB'}} onClick={handleRemove}>
                    Remove
                </button>
            </div>
        </div>
    )
}

export default ProfileCard