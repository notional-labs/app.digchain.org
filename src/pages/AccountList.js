import ProfileCard from "../components/ProfileCard"
import ConnectButton from "../components/ConnectButton"

const style = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
    },
    card: {
        margin: 10,
    },
    button: {
        marginTop: '3rem',
        textAlign: 'left'
    },
}

const AccountList = ({ accounts, wrapSetShow }) => {
    console.log(accounts)
    return (
        <div style={style.container}>
            <div style={{ marginBottom: '0.5rem', textAlign: 'left', fontSize: '3rem', color: '#EFCF20', fontFamily: 'Ubuntu', fontWeight: 600, }}>
                Accounts
            </div>
            {accounts.map(account => (
                <div style={style.card}>
                    <ProfileCard account={account} />
                </div>
            ))}
            <div style={style.button}>
                <ConnectButton wrapSetShow={wrapSetShow} />
            </div>
        </div>
    )
}

export default AccountList