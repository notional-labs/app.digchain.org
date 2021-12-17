import axios from 'axios' 

export const getValidators = async() => {
    const res = await axios.get('http://65.21.202.37:8003/staking/validators')
    if (res.status === 200) {
        let validators = res.data.result
        validators.map(async (val) => val.logo = await getLogo(val.description.identity))
        return validators
    }
    return []
}

export const getLogo = async (identity) => {
    const res = await axios.get(`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`)
    if( res.status === 200 && res.data.status.code === 0){
        return res.data.them[0].pictures.primary.url
    }
    return null
}
