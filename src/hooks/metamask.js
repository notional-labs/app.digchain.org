import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core';
import { injected } from '../components/connector';

export const MetamaskContext = React.createContext(null)

export const MetamaskProvider = ({ children }) => {

    const { activate, account, library, connector, active, deactivate } = useWeb3React()

    const [isActive, setIsActive] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Init Loading
    useEffect(() => {
        connect().then(val => {
            setIsLoading(false)
        })
    }, [])

    const handleIsActive = useCallback(() => {
        setIsActive(active)
    }, [active])

    useEffect(() => {
        handleIsActive()
    }, [handleIsActive])

    // Connect to Metamask wallet
    const connect = async () => {
        console.log('Connecting to Metamask Wallet')
        try {
            await activate(injected)
        } catch(error) {
            console.log('Error on connecting: ', error)
        }
    }

    // Disconnect from Metamask wallet
    const disconnect = async () => {
        console.log('Deactivating...')
        try {
            await deactivate()
        } catch(error) {
            console.log('Error on disconnecting: ', error)
        }
    }

    const values = useMemo(
        () => ({
            isActive,
            account,
            isLoading,
            connect,
            disconnect
        }),
        [isActive, isLoading]
    )

    return <MetamaskContext.Provider value={values}>{children}</MetamaskContext.Provider>
}

export default function useMetamask() {
    const context = React.useContext(MetamaskContext)

    if (context === undefined) {
        throw new Error('useMetamask hook must be used with a MetamaskProvider component')
    }

    return context
}