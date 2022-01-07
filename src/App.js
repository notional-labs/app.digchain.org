import './App.css';
import { Modal, } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import ConnectButton from './components/ConnectButton';
import AccountDetail from './pages/AccountDetail';
import { getKeplr, addDig } from './helpers/getKeplr';
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
import { Image, message } from 'antd';
import { getWeb3Instance } from "./helpers/ethereum/lib/metamaskHelpers";
import { GithubFilled } from '@ant-design/icons'
import "@fontsource/merriweather"
import AccountList from './pages/AccountList';
import { FaDiscord } from "react-icons/fa";


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
  },
  contact: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
  }
}

const App = () => {
  const [accounts, setAccounts] = useState(JSON.parse(localStorage.getItem('accounts')) || [])
  const [show, setShow] = useState(false)
  const [page, setPage] = useState('')

  const wrapSetShow = useCallback((val) => {
    setShow(val)
  }, [setShow])

  const wrapSetAccounts = useCallback((val) => {
    setAccounts([...val])
  }, [setAccounts])

  const wrapSetPage = useCallback((val) => {
    setPage(val)
  }, [setPage])


  const handleClose = () => {
    setShow(false)
  }

  const warning = (val) => {
    message.warning(val, 1)
  }

  const connect = async (val) => {
    if (val === 'keplr') {
      const { accounts } = await getKeplr()
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
          warning('Success')
        }
        else {
          warning('this wallet account already exist')
        }
      }
    }
    else {
      let web3 = await getWeb3Instance();
      const accounts = (await web3.eth.getAccounts());

      if (!localStorage.getItem('accounts')) {
        localStorage.setItem('accounts', JSON.stringify([{ account: accounts[0], type: 'metamask' }]))
      }
      if (localStorage.getItem('accounts')) {
        let accountsList = JSON.parse(localStorage.getItem('accounts'))
        if (accountsList.filter(acc => acc.type === "metamask" && acc.account === accounts[0]).length === 0) {
          accountsList.push({ account: accounts[0], type: 'metamask' })
          localStorage.setItem('accounts', JSON.stringify(accountsList))
          setAccounts([...accountsList])
          warning('Success')
        }
        else {
          warning('This wallet account already exist')
        }
      }
      //metamask logic
    }
  }

  const handleOver = (e) => {
    e.target.style.backgroundColor = '#ffc87a'
  }

  const handleLeaveAccount = (e) => {
    if (page !== 'account') {
      e.target.style.backgroundColor = 'transparent'
    }
  }

  const handleLeaveStaking = (e) => {
    if (page !== 'staking') {
      e.target.style.backgroundColor = 'transparent'
    }
  }

  return (
    <div className="App container-fluid">
      <Router>
        <div style={style.navbar}>
          <div style={{ paddingLeft: '3rem', paddingTop: '1rem' }}>
            <Image width={70}
              src={logo}
              preview={false} />
          </div>
          <div style={{ marginRight: '5rem' }}>
            <ul style={{ ...style.tabButton, listStyleType: 'none' }}>
              <li>
                <Link to='/accounts'>
                  <button style={{
                    marginRight: '1rem',
                    fontSize: '1.2rem',
                    backgroundColor: page === 'account' ? '#ffb957' : 'transparent',
                    color: '#F6F3FB',
                    padding: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    width: '10rem',
                    borderRadius: '50px',
                    border: 0,
                    fontFamily: 'MerriWeather',
                  }} onMouseEnter={handleOver} onMouseLeave={handleLeaveAccount} onClick={() => { setPage('account') }}>
                    Accounts
                  </button>
                </Link>
              </li>
              <li>
                <Link to='/staking'>
                  <button style={{
                    marginRight: '3rem',
                    fontSize: '1.2rem',
                    backgroundColor: page === 'staking' ? '#ffb957' : 'transparent',
                    color: '#F6F3FB',
                    padding: 10,
                    width: '10rem',
                    borderRadius: '50px',
                    border: 0,
                    paddingTop: 5,
                    paddingBottom: 5,
                    fontFamily: 'MerriWeather',
                  }} onMouseEnter={handleOver} onMouseLeave={handleLeaveStaking} onClick={() => { setPage('staking') }}>
                    Staking
                  </button>
                </Link>
              </li>
              <li>
                <ConnectButton wrapSetShow={wrapSetShow} />
              </li>
            </ul>
          </div>
        </div>
        <Routes>
          <Route exact path="/" element={<div style={{ height: '77vh' }}></div>} />
          <Route exact path="/staking" element={<ValidatorsList />} />
          <Route exact path="/accounts" element={<AccountList accounts={accounts} wrapSetAccounts={wrapSetAccounts} />} />
          <Route exact path="/accounts/:id" element={<AccountDetail accounts={accounts} wrapSetPage={wrapSetPage} />} />
        </Routes>
        <div style={style.contact}>
          <ul style={{ ...style.tabButton, listStyleType: 'none',}}>
            <li style={{
              paddingTop: '1em',
              fontSize: '1.2rem',
              color: '#ffc16b',
              marginRight: '1em'
            }}>
              <p>
                Contact Us |
              </p>
            </li>
            <li style={{
              fontSize: '2rem',
              color: '#ffc16b',
              marginRight: '1em',
            }}>
              <a href='https://github.com/notional-labs' target='_blank'>
                <GithubFilled style={{color: '#ffc16b',}}/>
              </a>
            </li>
            <li style={{
              fontSize: '2.5rem',
              color: '#ffc16b',
              marginRight: '1em',
            }}>
              <a href='https://github.com/notional-labs' target='_blank'>
                <FaDiscord style={{color: '#ffc16b',}}/>
              </a>
            </li>
          </ul>
        </div>
      </Router>
      <>
        <Modal show={show} onHide={handleClose} centered={true}>
          <Modal.Header style={{
            backgroundColor: '#1f1f1f',
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
          <Modal.Body style={{ backgroundColor: '#1f1f1f', paddingBottom: '20px' }}>
            <div style={style.divButton}>
              <button style={{
                borderRadius: '20px',
                backgroundColor: '#ffa424',
                color: '#696969',
                margin: 10,
                border: 0
              }}
                onClick={async () => {
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
                    <p style={{ margin: 0, textAlign: 'left', color: '#3b3b3b' }}>Keplr</p>
                    <p style={{ fontSize: '0.75rem', color: '#696969' }}>
                      Keplr browser extension
                    </p>
                  </div>
                </div>
              </button>
              <button style={{
                borderRadius: '20px',
                backgroundColor: '#ffa424',
                color: '#696969',
                margin: 10,
                border: 0
              }}
                onClick={async () => {
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
                    <p style={{ margin: 0, textAlign: 'left', color: '#3b3b3b' }}>Metamask</p>
                    <p style={{ fontSize: '0.75rem', color: '#696969' }}>
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