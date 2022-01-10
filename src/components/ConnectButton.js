import "@fontsource/merriweather"

const style = {
    button: {
        width: '100%',
        height: '2.5rem',
        borderRadius: '50px',
        backgroundImage: 'linear-gradient(180deg, #f4ea57, #ffa82e)',
        border: 'solid 1px black',
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
        <div style={{width: '10rem', fontSize: '1.2rem',color: '#545454', fontFamily: 'Merriweather',borderRadius: '20px' , boxShadow: '1px 3px 30px 5px black'}}>
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