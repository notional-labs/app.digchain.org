import "@fontsource/merriweather"

const style = {
    button: {
        width: '100%',
        height: '2.5rem',
        borderRadius: '50px',
        backgroundImage: 'linear-gradient(180deg, #f4ea57, #ffa82e)',
    },
    buttonText: {
        fontSize: '1.2rem',
        color: '#545454',
        fontFamily: 'Merriweather'
    }
}

const ConnectButton = ({ wrapSetShow }) => {

    const handleOver = (e) => {
        e.target.style.transform = 'translate(0, -5px)'
    }

    const handleLeave = (e) => {
        e.target.style.transform = 'translate(0, 0)'
    }
    
    return (
        <div style={{width: '10rem', fontSize: '1.2rem',color: '#545454', fontFamily: 'Merriweather',borderRadius: '20px' , boxShadow: '1px 1px 20px 1px #d49622'}}>
            <button onMouseEnter={handleOver}
                onMouseLeave={handleLeave}
                style={style.button}
                onClick= { async() => {
                    await wrapSetShow(true)
                }}>
                Connect
               
            </button>
        </div>
    )
}

export default ConnectButton