import axios from 'axios'

export const getValidators = async (logoDisableFlag) => {
    const res = await axios.get('http://0.0.0.0:1317/staking/validators')

    // const res = await axios.get('https://api-1-dig.notional.ventures/staking/validators')
    if (res.status === 200) {
        let validators = res.data.result
        if (!logoDisableFlag) {
            let promises = []
            validators.forEach(val => {
                promises.push(getLogo(val.description.identity))
            })
            const logos = await Promise.all(promises)
            validators.map((val, index) => val.logo = logos[index])
        }
        return validators
    }
    return []
}

export const getLogo = async (identity) => {
    const res = await axios.get(`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${identity}&fields=pictures`)
    if (res.status === 200 && res.data.status.code === 0 && res.data.them[0] && res.data.them[0].pictures) {
        return res.data.them[0].pictures.primary.url
    }
    return null
}
