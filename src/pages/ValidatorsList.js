import { useEffect, useState } from 'react';
import { getValidators } from '../helpers/getValidators';
import "@fontsource/merriweather"
import PacmanLoader from "react-spinners/PacmanLoader";

const style = {
    table: {
        width: '100%',
        tableLayout: 'fixed',
    },
    tblHeader: {
        backgroundColor: '#3B2D52',
    },
    tblContent: {
        height: '300px',
        overflowX: 'auto',
        marginTop: '0px',
        borderRadius: '50px'
    },
    th: {
        padding: '15px 15px',
        textAlign: 'left',
        fontWeight: '700',
        fontSize: '15px',
        color: '#fff',
        textTransform: 'uppercase',
        fontFamily: 'sans-serif',
    },
    td: {
        padding: '15px',
        textAlign: 'left',
        verticalAlign: 'middle',
        fontWeight: '600',
        fontSize: '17px',
        color: '#fff',
        fontFamily: 'sans-serif',
        borderBottom: 'black'
    }
}

const ValidatorsList = ({ account }) => {
    const [validators, setValidators] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            let vals = await getValidators()
            vals = vals.sort((x, y) => y.delegator_shares - x.delegator_shares)
            setValidators([...vals])
        })()
    }, [])

    return (
        !loading ? (
            <div style={{ padding: 80, paddingLeft: 150, paddingRight: 150, }}>
                <div>
                    validators
                </div>
                <table cellpadding="10" cellspacing="0" border="0" style={style.table}>
                    <thead style={style.tblHeader}>
                        <tr>
                            <th style={{ ...style.th, width: '5rem', borderRadius: '20px 0 0 0' }}>#</th>
                            <th style={{ ...style.th, width: '30rem', }}>Validator</th>
                            <th style={{ ...style.th, width: '25rem', textAlign: 'right' }}>Voting power</th>
                            <th style={{ ...style.th, width: '25rem', textAlign: 'right' }}>Commision</th>
                            <th style={{ ...style.th, width: '10rem', borderRight: 0, borderRadius: '0 20px 0 0' }}></th>
                        </tr>
                    </thead>
                    <tbody style={style.tblContent}>
                        {validators.map((val, index) => (
                            <tr style={{ backgroundColor: index % 2 === 0 ? '#9D91B5' : '#867B97', }}>
                                <td style={{ ...style.td, borderRadius: index === validators.length - 1 && '0 0 0 20px' }}>{index + 1}</td>
                                <td style={style.td}>
                                    <div style={{ color: '#2d61b5', fontSize: '20px', fontWeight: 850 }}>{val.description.moniker}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.6 }}>{val.description.website}</div>
                                </td>
                                <td style={{ ...style.td, textAlign: 'right', color: '#ededed' }}>{`${parseInt(val.delegator_shares / 1000000)} DIG`}</td>
                                <td style={{ ...style.td, textAlign: 'right', color: '#e3e3e3' }}>{`${val.commission.commission_rates.rate * 100} %`}</td>
                                <td style={{ ...style.td, textAlign: 'center', borderRadius: index === validators.length - 1 && '0 0 20px 0' }}>
                                    <button style={{
                                        backgroundColor: '#AC99CF',
                                        border: 'solid 1px #121016',
                                        borderRadius: '10px',
                                        width: '70%',
                                        padding: 8,
                                        fontSize: '15px',
                                        fontWeight: 600
                                    }}>
                                        Delegate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <PacmanLoader color={'#473E56'} loading={loading} size={150} />
        )
    )
}

export default ValidatorsList