import "@fontsource/merriweather"

const style = {
    button: {
        width: '30rem',
        height: '6rem',
        borderRadius: '50px',
        backgroundColor: '#f4ea57',
        border: 'solid 1px black',
        boxShadow: '6px 6px #2C223E'
    },
    buttonText: {
        fontSize: '2rem',
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
        <div>
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