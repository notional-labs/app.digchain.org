import { useEffect, useState, useCallback } from "react"
import { getTxs } from "../helpers/getTxs"
import { Typography, } from 'antd';
import ButtonList from "./ButtonList";

const { Title, Paragraph } = Typography;

const style = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 0,
        paddingBottom: 20
    },
    button: {
        border: 0,
        borderRadius: '10px',
        width: '100%',
        height: '40px',
        margin: 10,
        marginBottom: 0,
        marginLeft: 0,
        fontFamily: 'ubuntu',
        fontWeight: 600,
        backgroundColor: '#2e2c27',
        color: '#F6F3FB'
    },
    table: {
        width: '100%',
    },
    tdlHeader: {
        backgroundColor: '#ffa538',
    },
    tdlContent: {
        marginTop: '0px',
        borderRadius: '50px',
        paddingTop: 0
    },
    th: {
        padding: '15px 15px',
        textAlign: 'left',
        fontWeight: '700',
        fontSize: '15px',
        color: '#ffffff',
        textTransform: 'uppercase',
        fontFamily: 'Ubuntu',
    },
    td: {
        padding: '15px',
        textAlign: 'left',
        verticalAlign: 'middle',
        fontWeight: '500',
        fontSize: '1rem',
        color: '#696969',
        fontFamily: 'Ubuntu',
    }
}

const timeStampHandler = (time) => {
    let date = new Date(time)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}

const getMsgType = (tx) => {
    const msg = tx.value.msg[0].type || ''
    const type = msg.split('Msg')[1]
    return type
}

const TxList = ({ address }) => {
    const [txs, setTxs] = useState([])
    const [params, setParams] = useState({
        page: 1,
        limit: 5,
    })
    const [total, setTotal] = useState(0)
    const [isLoading, setIsloading] = useState(false)

    useEffect(() => {
        (async () => {
            setIsloading(true)
            const res = await getTxs(address, params)
            setTxs([...res.txs])
            setTotal(res.page_total)
            setIsloading(false)
        })()
    }, [params])

    const wrapSetParams = useCallback((val) => {
        setParams({
            ...params,
            page: val
        })
    }, [setParams])
    return (
        <div style={{ padding: 20, paddingTop: 0 }}>
            <div style={style.container}>
                <Title style={{ color: '#F6F3FB', fontSize: '2rem', fontWeight: 500, fontFamily: 'Ubuntu' }}>
                    Transaction
                </Title>
            </div>
            {
                !isLoading && txs.length > 0 && (
                    <div>
                        <table cellPadding="0" cellSpacing="0" border="0" style={style.table}>
                            <thead style={style.tdlHeader}>
                                <tr>
                                    <th style={{ ...style.th, width: '20%' }}>Height</th>
                                    <th style={{ ...style.th, width: '10rem', textAlign: 'left' }}>Tx Hash</th>
                                    <th style={{ ...style.th, width: '10rem', textAlign: 'left' }}>MSGS</th>
                                    <th style={{ ...style.th, width: '10rem', textAlign: 'left' }}>Time</th>
                                </tr>
                            </thead>
                            <tbody style={style.tdlContent}>
                                {txs.map((tx, index) => (
                                    <tr key={index} style={{ backgroundColor: index % 2 !== 0 && '#ffe1bd', borderBottom: 'solid 1px #ffffff' }}>
                                        <td style={{ ...style.td, }}>
                                            {tx.height || ''}
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'left', width: '50%' }}>
                                            <Paragraph copyable={tx.txhash} style={{color: '#1778ff'}}>
                                                {tx.txhash || ''}
                                            </Paragraph>
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'left', width: '10%' }}>
                                            {getMsgType(tx.tx) || ''}
                                        </td>
                                        <td style={{ ...style.td, textAlign: 'left', width: '30%' }}>
                                            {tx.timestamp && timeStampHandler(tx.timestamp) || ''}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} >
                            <ButtonList total={total} wrapSetParams={wrapSetParams} currentPage={params.page}/>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default TxList