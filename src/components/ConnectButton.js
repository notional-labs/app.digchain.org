import "@fontsource/merriweather"

const style = {
    button: {
        width: '100%',
        height: '2.5rem',
        borderRadius: '50px',
        backgroundColor: '#f4ea57',
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
        e.target.style.transform = 'scale(1.01)'
    }

    const handleLeave = (e) => {
        e.target.style.transform = 'scale(1)'
    }

    return (
        <div style={{width: '10rem'}}>
            <button onMouseEnter={handleOver}
                onMouseLeave={handleLeave}
                style={style.button}
                onClick= { async() => {
                    await wrapSetShow(true)
                }}>
                <div style={style.buttonText}>
                    Connect
                </div>
            </button>
        </div>
    )
}

export default ConnectButton