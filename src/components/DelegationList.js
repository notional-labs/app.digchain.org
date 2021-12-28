
import { Typography, } from 'antd';
import DelegateModal from './DelegateModal';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const style = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 0
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
        backgroundColor: '#AC99CF',
        color: '#F6F3FB'
    },
}

const DelegationList = ({ delegations, rewards }) => {
    return (
        <div>
            <div style={style.container}>
                <Title style={{ color: '#F6F3FB', fontSize: '2rem', fontWeight: 500, fontFamily: 'Ubuntu' }}>
                    Delegation
                </Title>
                <div style={{ width: '10%' }}>
                    <Link to='/staking' style={{ width: '30%' }}>
                        <button style={style.button}>
                            Delegate
                        </button>
                    </Link>
                </div>
            </div>
            <div>
                <table cellPadding="0" cellSpacing="0" border="0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Validator</th>
                            <th>Token</th>
                            <th>Reward</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rewards.map((reward, index) => (
                            <tr>
                                <tb>
                                    {index + 1}
                                </tb>
                                <tb>
                                    {reward.validator_address.substring(0, 10)} |
                                </tb>
                                <tb>
                                    {parseInt(delegations.filter(x => x.delegation.validator_address === reward.validator_address)[0].delegation.shares)/1000000} |
                                </tb>
                                <tb>
                                    {parseInt(reward.reward[0].amount) / 1000000} |
                                </tb>
                                <tb>
                                    <button>
                                        Redelegate
                                    </button>
                                    <button>
                                        Unbonding
                                    </button>
                                </tb>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DelegationList