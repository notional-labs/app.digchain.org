import './App.css';
import { Modal, } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import ConnectButton from './components/ConnectButton';
import { getKeplr, } from './helpers/getKeplr';
import ValidatorsList from './pages/ValidatorsList';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import logo from './assets/img/DIG.png';
import keplrLogo from './assets/img/keplr.png'
import metaMaskLogo from './assets/img/metamask.png'
import { Image, } from 'antd';
import { getWeb3Instance } from "./helpers/ethereum/lib/metamaskHelpers";

import "@fontsource/merriweather"
import AccountList from './pages/AccountList';


const style = {
  button: {
    marginTop: '5rem',
  },
  divButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  tabButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '1rem'
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    paddingTop: 20,
    paddingLeft: 20,
  }
}

const App = () => {
  const [accounts, setAccounts] = useState(JSON.parse(localStorage.getItem('accounts')) || [])
  const [show, setShow] = useState(false)

  const wrapSetShow = useCallback(async (val) => {
    setShow(val)
  }, [setShow])

  const handleClose = () => {
    setShow(false)
  }

  const connect = async (val) => {
    if (val === 'keplr') {
      const { accounts } = await getKeplr(val)
      console.log(accounts)
      if (!localStorage.getItem('accounts')) {
        localStorage.setItem('accounts', JSON.stringify([{ account: accounts[0], type: 'keplr' }]))
        setAccounts([...{ account: accounts[0], type: 'keplr' }])
      }
      else if (localStorage.getItem('accounts')) {
        let accountsList = JSON.parse(localStorage.getItem('accounts'))
        if (accountsList.filter(acc => acc.account.address === accounts[0].address).length === 0) {
          accountsList.push({ account: accounts[0], type: 'keplr' })
          localStorage.setItem('accounts', JSON.stringify(accountsList))
          setAccounts([...accountsList])
        }
      }
    }
    else {
      let web3 = await getWeb3Instance();
      const accounts = (await web3.eth.getAccounts());
      
      if (!localStorage.getItem('accounts')) {
        localStorage.setItem('accounts', JSON.stringify([{account: accounts[0], type: 'keplr'}]))
      }
      if (localStorage.getItem('accounts')) {
        let accountsList = JSON.parse(localStorage.getItem('accounts'))
        if (accountsList.filter(acc => acc.account.address === accounts[0].address).length === 0) {
          accountsList.push({account: accounts[0], type: 'metamask'})
          localStorage.setItem('accounts', JSON.stringify(accountsList))
        }
      }    
      //metamask logic
  }
}

  const handleOver = (e) => {
    e.target.style.border = 'solid 1px black'
  }

  const handleLeave = (e) => {
    e.target.style.border = 0
  }


  let Main = (<div style={style.button}>
    <ConnectButton wrapSetShow={wrapSetShow} />
  </div>)


  return (
    <div className="App" style={{ width: 'auto', minWidth: window.screen.availWidth, height: 'auto', minHeight: '100%' }}>
      <Router>
        <div style={style.navbar}>
          <div style={{ paddingLeft: '3rem' }}>
            <Image width={100}
              src={logo}
              preview={false} />
          </div>
          <div style={{ marginRight: '5rem' }}>
            <ul style={{ ...style.tabButton, listStyleType: 'none' }}>
              <li>
                <Link to='/accounts'>
                  <button style={{
                    marginRight: '0.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#7c5e93',
                    color: '#2C223E',
                    padding: 10,
                    width: '8rem',
                    borderRadius: '50px',
                    border: 0,
                    fontFamily: 'MerriWeather',
                  }} onMouseEnter={handleOver} onMouseLeave={handleLeave}>
                    Accounts
                  </button>
                </Link>
              </li>
              <li>
                <Link to='/staking'>
                  <button style={{
                    marginRight: '3rem',
                    fontSize: '1rem',
                    backgroundColor: '#7c5e93',
                    color: '#2C223E',
                    padding: 10,
                    width: '8rem',
                    borderRadius: '50px',
                    border: 0,
                    fontFamily: 'MerriWeather',
                  }} onMouseEnter={handleOver} onMouseLeave={handleLeave}>
                    Staking
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Routes>
          <Route exact path="/" element={Main} />
          <Route exact path="/staking" element={<ValidatorsList />} />
          <Route exact path="/accounts" element={<AccountList accounts={accounts} wrapSetShow={wrapSetShow}/>} />
        </Routes>
      </Router>
      <>
        <Modal show={show} onHide={handleClose} centered={true}>
          <Modal.Header style={{
            backgroundColor: '#3c314f',
            color: '#F6F3FB',
            fontFamily: 'ubuntu',
            fontSize: '1.2rem',
            border: 0,
            paddingTop: '20px',
            paddingLeft: '1.8rem',
            paddingBottom: 10
          }}
            closeButton
            closeVariant='white'>
            <Modal.Title>Connect Wallet</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#3c314f', paddingBottom: '20px' }}>
            <div style={style.divButton}>
              <button style={{
                borderRadius: '20px',
                backgroundColor: '#201A2B',
                color: '#383838',
                margin: 10,
                border: 0
              }}
                onClick={async() => {
                  await connect('keplr')
                  setShow(false)
                }}>
                <div style={style.buttonContent}>
                  <div>
                    <Image width={50}
                      src={keplrLogo}
                      preview={false} />
                  </div>
                  <div style={{ marginLeft: '10px', fontSize: '1.5rem', }}>
                    <p style={{ margin: 0, textAlign: 'left', color: '#F6F3FB' }}>Keplr</p>
                    <p style={{ fontSize: '0.75rem', color: '#c9c9c9' }}>
                      Keplr browser extension
                    </p>
                  </div>
                </div>
              </button>
              <button style={{
                borderRadius: '20px',
                backgroundColor: '#201A2B',
                color: '#383838',
                margin: 10,
                border: 0
              }}
                onClick={async() => {
                  await connect('metamask')
                  setShow(false)
                }}>
                <div style={style.buttonContent}>
                  <div>
                    <Image width={50}
                      src={metaMaskLogo}
                      preview={false} />
                  </div>
                  <div style={{ marginLeft: '10px', fontSize: '1.5rem' }}>
                    <p style={{ margin: 0, textAlign: 'left', color: '#F6F3FB' }}>Metamask</p>
                    <p style={{ fontSize: '0.75rem', color: '#c9c9c9' }}>
                      Metamask browser extension
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
}

export default App;