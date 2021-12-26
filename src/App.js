import './App.css';
import { Modal, Button } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import ConnectButton from './components/ConnectButton';
import { getKeplr, } from './helpers/getKeplr';
import { getBalance } from './helpers/getBalances';
import Profile from './components/Profile';
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
import "@fontsource/merriweather"


const style = {
  button: {
    marginTop: '25rem',
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
  const [account, setAccount] = useState({
    address: '',
    amount: '',
  })
  const [show, setShow] = useState(false)
  const [chain, setChain] = useState(localStorage.getItem('CHAIN_ID') || '')

  const wrapSetShow = useCallback(async (val) => {
    setShow(val)
    // await connect(chain)
  }, [setShow])

  const handleClose = () => {
    setShow(false)
  }

  const connect = async (val) => {
    const { accounts } = await getKeplr(val)
    const balance = await getBalance(accounts[0].address)
    const amount = balance.length > 0 ? balance[0][0].amount : 0
    setAccount({
      address: accounts[0].address,
      amount: amount
    })
    if (!localStorage.getItem('accounts')) {
      localStorage.setItem('accounts', JSON.stringify([accounts[0]]))
    }
    else if (localStorage.getItem('accounts')) {
      let accountsList = JSON.parse(localStorage.getItem('accounts'))
      if (accountsList.filter(acc => acc.address === accounts[0].address).length === 0) {
        accountsList.push(accounts[0])
        localStorage.setItem('accounts', JSON.stringify(accountsList))
      }
    }
  }

  const handleClick = () => {
    setAccount({
      address: '',
      amount: '',
    })
  }

  const handleOver = (e) => {
    e.target.style.border = 'solid 1px black'
  }

  const handleLeave = (e) => {
    e.target.style.border = 0
  }


  let Main = account.address === '' ? (
    <div style={style.button}>
      <ConnectButton wrapSetShow={wrapSetShow} />
    </div>
  ) : (
    <div>
      <Profile account={account} />
    </div>
  )

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
                <Link to='/account'>
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
              <li style={{ visibility: account.address !== '' ? 'visible' : 'hidden' }}>
                <button style={{
                  fontSize: '1rem',
                  backgroundColor: '#f27c7c',
                  color: '#2C223E',
                  padding: 5,
                  width: '10rem',
                  borderRadius: '50px',
                  border: 'solid 1px black',
                  fontFamily: 'MerriWeather'
                }} onClick={handleClick}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
        <Routes>
          <Route exact path="/" element={Main} />
          <Route exact path="/staking" element={<ValidatorsList />} />
          <Route exact path="/convert" element={Main} />
          <Route exact path="/accounts" element={Main} />
        </Routes>
      </Router>
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header style={{
            backgroundColor: '#3c314f',
            color: '#F6F3FB',
            fontFamily: 'ubuntu',
            fontSize: '1.2rem',
            border: 0,
            paddingTop: '20px'
          }}
            closeButton
            closeVariant='white'>
            <Modal.Title>Connect Wallet</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#3c314f', paddingBottom: '20px'}}>
            <div style={style.divButton}>
              <button style={{
                borderRadius: '20px',
                backgroundColor: '#201A2B',
                color: '#383838',
                margin: 10,
                border: 0
              }}
                onClick={() => {
                  connect('dig-1')
                  setShow(false)
                }}>
                <div style={style.buttonContent}>
                  <div>
                    <Image width={50}
                      src={keplrLogo}
                      preview={false} />
                  </div>
                  <div style={{ marginLeft: '10px', fontSize: '1.5rem',}}>
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
                onClick={() => {
                  connect('eth')
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