import { Typography, } from 'antd';
import "@fontsource/merriweather"
import { getBalance } from '../helpers/getBalances';
import { useEffect, useState } from 'react';

const { Title, Paragraph } = Typography;

const style = {
    container: {
        backgroundColor: '#f4ea57',
        padding: 24,
        borderRadius: '10px',
        border: 'solid 1px black',
        width: '20%',
        height: '40%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    outline: {
        marginTop: '7em',
        padding: 10,
        border: 'solid 10px #f4ea57',
        borderRadius: '80px',
    },
    div: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    }
}

const ProfileCard = ({ account }) => {
    const [amount, setAmount] = useState('')

    return (
        <div style={style.container}>
            <Paragraph copyable={{ text: account.account.address }} style={{ color: '#2a3158', fontFamily: 'Merriweather' }}>
                {account.account.address.length > 100 ? `${account.account.address.substring(0, 100)}... ` : `${account.account.address} `}
            </Paragraph>
            <div>
                <button>
                    transfer
                </button>
                <button>
                    Detail
                </button>
            </div>
        </div>
    )
}

export default ProfileCard