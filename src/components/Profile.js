import { Typography, } from 'antd';
import "@fontsource/merriweather"
import React from 'react';

const { Title, Paragraph } = Typography;

const style = {
    container: {
        backgroundColor: '#f4ea57',
        padding: 24,
        marginTop: '0.2em',
        borderRadius: '60px',
        border: 'solid 1px black',
        width: '100%',
        height: '100%',
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

const Profile = ({ account }) => {
    console.log(account)
    return (
        <div style={style.div}>
            <div style={style.outline}>
                <div style={style.container}>
                    <Title style={{ color: '#2a3158', marginRight: '18rem' }} level={3}>Wallet info</Title>
                    <hr style={{ marginTop: 0 }} />
                    <div style={{ border: 'solid 1px black', backgroundColor: '#ffffff', padding: 10, borderRadius: '50px', paddingTop: '1.5rem', marginTop: '20px', marginBottom: '20px', }}>
                        <Paragraph copyable={{ text: account.address }} style={{ color: '#2a3158', fontFamily: 'Merriweather' }}>
                            {account.address.length > 100 ? `${account.address.substring(0, 100)}... ` : `${account.address} `}
                        </Paragraph>
                    </div>
                    <hr />
                    <div style={{ marginBottom: '2rem', border: 'solid 1px black', borderRadius: '20px', padding: '20px', marginTop: '1rem' }}>
                        <Title style={{ color: '#2a3158', marginRight: '21rem', fontFamily: 'Merriweather', marginTop: '1rem' }} level={4}>Amount</Title>
                        <div style={{ border: 'solid 1px black', backgroundColor: '#ffffff', padding: 10, borderRadius: '50px', marginTop: '10px', color: '#2a3158', height: '50%', fontSize: '2rem' }}>
                            {parseInt(account.amount) / 1000000} DIG
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile