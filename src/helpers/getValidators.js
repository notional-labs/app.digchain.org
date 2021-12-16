import axios from 'axios' 

export const getValidators = async() => {
    const res = await axios.get('http://65.21.202.37:8003/staking/validators')
    if (res.status === 200) {
        return res.data.result
    }
    return []
}