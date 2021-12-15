import { Typography, } from 'antd';
import "@fontsource/merriweather"


const { Title, Paragraph } = Typography;

const style = {
    container: {
        backgroundColor: '#f4ea57',
        padding: 24,
        marginTop: '15em',
        borderRadius: '8px',
        border: 'solid 1px black',
        width: '103%',
        height: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
}

const Profile = ({ account }) => {
    console.log(account)
    return (
        <div style={style.container}>
            <Title style={{ color: '#2a3158', marginRight: '18rem' }} level={3}>Wallet info</Title>
            <hr style={{ marginTop: 0 }} />
            <div style={{ border: 'solid 1px black', backgroundColor: '#ffffff', padding: 10, borderRadius: '50px', paddingTop: '1.5rem', marginTop: '30px', marginBottom: '30px', }}>
                <Paragraph copyable={{ text: account.address }} style={{ color: '#2a3158', fontFamily: 'Merriweather' }}>
                    {account.address.length > 100 ? `${account.address.substring(0, 100)}... ` : `${account.address} `}
                </Paragraph>
            </div>
            <hr />
            <div style={{marginBottom: '2rem', }}>
                <Title style={{ color: '#2a3158', marginRight: '21rem', fontFamily: 'Merriweather', marginTop: '2rem' }} level={4}>Amount</Title>
                <div style={{ border: 'solid 1px black',backgroundColor: '#ffffff', padding: 10, borderRadius: '50px', marginTop: '10px', color: '#2a3158', height: '50%', fontSize: '2rem' }}>
                    {account.amount} UDIG
                </div>
            </div>
        </div>
    )
}

export default Profile