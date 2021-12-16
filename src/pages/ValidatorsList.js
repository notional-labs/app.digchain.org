import { useEffect, useState } from 'react';
import { getValidators } from '../helpers/getValidators';
import { Table } from 'react-bootstrap'

const ValidatorsList = () => {
    const [validators, setValidators] = useState([])

    console.log(validators)
    useEffect(() => {
        (async () => {
            const vals = await getValidators()
            setValidators([...vals])
        })()
    }, [])

    return (
        <div style={{padding: 70}}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Validator</th>
                        <th>Voting power</th>
                        <th>Commision</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {validators.map((val, index) => (
                        <tr>
                            <td>{index}</td>
                            <td>{val.description.moniker}</td>
                            <td>{val.delegator_shares}</td>
                            <td>{val.commission.commission_rates.rate}</td>
                            <td>
                                <button>
                                    Delegate
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default ValidatorsList