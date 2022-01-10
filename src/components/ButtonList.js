import { useState, useEffect } from 'react'

const style = {
    container: {
        marginTop: '1.5em',
        padding: 0,
        width: '20%',
        backgroundColor: '#e8e8e8',
        borderRadius: '20px'
    },
    button: {
        borderRadius: '20px',
        color: 'white',
        margin: '0.3em',
        border: 0,
        width: '10%',
        height: '20%'
    }
}

const ButtonList = ({ total, wrapSetParams, currentPage }) => {
    const [buttons, setButtons] = useState([])

    const handleOver = (e) => {
        e.target.style.transform = 'translate(0, -5px)'
    }

    const handleLeave = (e) => {
        e.target.style.transform = 'translate(0, 0)'
    }

    const handleCLick = (index) => {
        wrapSetParams(index)
    }

    useEffect(() => {
        let buttonList = []
        for (let i = 0; i < total; i++) {
            buttonList.push(
                <button onMouseEnter={handleOver}
                    onMouseLeave={handleLeave}
                    style={{ ...style.button, backgroundColor: currentPage === i + 1 ? '#ffab19' : '#2e2e2e', }}
                    onClick={() => handleCLick(i + 1)}>
                    {i + 1}
                </button>
            )
        }
        setButtons([...buttonList])
    }, [total])
    return (
        <div style={style.container}>
            {
                total <= 5 ? (
                    <div>
                        {buttons.map(button => button)}
                    </div>
                ) : currentPage - 1 <= 1 ? (
                    <div>
                        {buttons.map((button, index) => { if (index < 3) return button })}
                        <span>
                            <span style={{ color: '#2e2e2e', fontSize: '1.2rem' }}>...</span>{buttons[total - 1]}
                        </span>
                    </div>
                ) : currentPage - 1 === 2 ? (
                    <div>
                        {buttons.map((button, index) => { if (index <= 3) return button })}
                        <span>
                            <span style={{ color: '#2e2e2e', fontSize: '1.2rem' }}>...</span>{buttons[total - 1]}
                        </span>
                    </div>
                ) : total - currentPage <= 1 ? (
                    <div>
                        <span>
                            {buttons[0]}<span style={{ color: '#2e2e2e', fontSize: '1.2rem' }}>...</span>
                        </span>
                        {buttons.map((button, index) => index >= total - 3 && button)}
                    </div>
                ) : total - currentPage === 2 ? (
                    <div>
                        <span>
                            {buttons[0]}<span style={{ color: '#2e2e2e', fontSize: '1.2rem' }}>...</span>
                        </span>
                        {buttons.map((button, index) => index >= total - 4 && button)}
                    </div>
                ) : (
                    <div>
                        <span>
                            {buttons[0]}<span style={{ color: '#2e2e2e', fontSize: '1.2rem' }}>...</span>
                        </span>
                        <span>
                            {buttons[currentPage - 2]}
                        </span>
                        <span>
                            {buttons[currentPage - 1]}
                        </span>
                        <span>
                            {buttons[currentPage]}
                        </span>
                        <span>
                            <span style={{ color: '#2e2e2e', fontSize: '1.2rem' }}>...</span>{buttons[total - 1]}
                        </span>
                    </div>
                )
            }
        </div>
    )
}

export default ButtonList