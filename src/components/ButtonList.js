import { useState, useEffect } from 'react'
import { DoubleLeftOutlined, LeftOutlined, RightOutlined, DoubleRightOutlined } from '@ant-design/icons'

const style = {
    container: {
        padding: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        borderRadius: '50%',
        margin: '0.7em',
        marginTop: '0.3em',
        marginBottom: '0.3em',
        border: 0,
    },
    quickButton: {
        border: 'none',
        color: '#000000',
        backgroundColor: 'transparent'
    }
}

const ButtonList = ({ total, wrapSetParams, currentPage }) => {
    const [buttons, setButtons] = useState([])

    const handleOver = (e, i) => {
        if (currentPage != i + 1) {
            e.target.style.backgroundColor = 'rgb(0, 0, 0, 0.25)'
        }
    }

    const handleLeave = (e, i) => {
        if (currentPage != i + 1) {
            e.target.style.backgroundColor = 'transparent'
        }
    }

    const handleCLick = (index) => {
        wrapSetParams(index)
    }

    const checkDisable = (type) => {
        if (type === 'double-left') {
            if (currentPage == 1) return true
            return false
        }
        if (type === 'left') {
            if (currentPage == 1) return true
            return false
        }
        if (type === 'right') {
            if (currentPage == total) return true
            return false
        }
        if (type === 'double-right') {
            if (currentPage == total) return true
            return false
        }
    }

    useEffect(() => {
        let buttonList = []
        for (let i = 0; i < total; i++) {
            buttonList.push(
                <button onMouseEnter={(e) => { handleOver(e, i) }}
                    onMouseLeave={(e) => { handleLeave(e, i) }}
                    style={{
                        ...style.button,
                        color: currentPage == i + 1 ? '#ffffff' : '#000000',
                        backgroundColor: currentPage == i + 1 ? '#EEC13F' : 'transparent',
                    }}
                    onClick={() => handleCLick(i + 1)}>
                    {i + 1}
                </button>
            )
        }
        setButtons([...buttonList])
    }, [total])
    return (
        <div style={style.container}>
            <div>
                <button
                    disabled={checkDisable('double-left')}
                    style={{ ...style.quickButton, color: currentPage == 1 ? 'rgb(0, 0, 0, 0.5)' : '#000000' }}
                    onClick={() => handleCLick(1)}>
                    <DoubleLeftOutlined />
                </button>
            </div>
            <div>
                <button
                    disabled={checkDisable('left')}
                    style={{ ...style.quickButton, color: currentPage == 1 ? 'rgb(0, 0, 0, 0.5)' : '#000000' }}
                    onClick={() => handleCLick(currentPage - 1)}>
                    <LeftOutlined />
                </button>
            </div>
            {
                total <= 5 ? (
                    <div>
                        {buttons.map(button => button)}
                    </div>
                ) : currentPage - 1 <= 1 ? (
                    <div>
                        {buttons.map((button, index) => { if (index < 5) return button })}
                    </div>
                ) : currentPage - 1 >= 1 && total - currentPage > 1 ? (
                    <div>
                        {buttons.map((button, index) => index < currentPage + 2 && index >= currentPage - 3 && button)}
                    </div>
                ) : total - currentPage === 1 ? (
                    <div>
                        {buttons.map((button, index) => index < total && index >= currentPage - 4 && button)}
                    </div>
                ) : (
                    <div>
                        {buttons.map((button, index) => index < total && index >= currentPage - 5 && button)}
                    </div>
                )
            }
            <div>
                <button
                    disabled={checkDisable('right')}
                    style={{ ...style.quickButton, color: currentPage === total ? 'rgb(0, 0, 0, 0.5)' : '#000000' }}
                    onClick={() => handleCLick(currentPage + 1)}>
                    <RightOutlined />
                </button>
            </div>
            <div>
                <button
                    disabled={checkDisable('double-right')}
                    style={{ ...style.quickButton, color: currentPage === total ? 'rgb(0, 0, 0, 0.5)' : '#000000' }}
                    onClick={() => handleCLick(total)}>
                    <DoubleRightOutlined />
                </button>
            </div>
        </div>
    )
}

export default ButtonList