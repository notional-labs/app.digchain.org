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
import { Image, } from 'antd';
import "@fontsource/merriweather"


const style = {
  button: {
    marginTop: '25rem',
  },
  divButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  tabButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '1rem'
  }
}

const App = () => {
  const [account, setAccount] = useState({
    address: '',
    amount: '',
  })
  const [pubKey, setPubKey] = useState([])
  const [show, setShow] = useState(false)
  const [chain, setChain] = useState(localStorage.getItem('CHAIN_ID') || '')

  const wrapSetShow = useCallback(async (val) => {
    if (chain == '') {
      setShow(val)
    }
    else {
      await connect(chain)
    }
  }, [setShow])

  const handleClose = () => {
    setShow(false)
  }

  const connect = async (val) => {
    const { accounts, offlineSigner } = await getKeplr(val)
    const balance = await getBalance(accounts[0].address)
    setAccount({
      address: accounts[0].address,
      amount: balance[0][0].amount
    })
    if (chain === '') {
      setChain(val)
      localStorage.setItem('CHAIN_ID', val)
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
    <div className="App" style={{ minWidth: window.screen.width, minHeight: window.screen.height, height: 'auto'}}>
      <Router>
        <div style={style.navbar}>
          <div style={{ marginLeft: '3rem' }}>
            <Image width={100}
              src={logo}
              preview={false} />
          </div>
          <div style={{ marginRight: '2rem' }}>
            <ul style={{ ...style.tabButton, listStyleType: 'none' }}>
              <li style={{ visibility: account.address !== '' ? 'visible' : 'hidden' }}>
                <Link to='/convert'>
                  <button style={{
                    marginRight: '1rem',
                    fontSize: '1.2rem',
                    backgroundColor: '#7c5e93',
                    color: '#2C223E',
                    padding: 10,
                    width: '8rem',
                    borderRadius: '50px',
                    border: 0,
                    fontFamily: 'MerriWeather',
                  }} onMouseEnter={handleOver} onMouseLeave={handleLeave}>
                    Convert 
                  </button>
                </Link>
              </li>
              <li style={{ visibility: account.address !== '' ? 'visible' : 'hidden' }}>
                <Link to='/stake'>
                  <button style={{
                    marginRight: '4rem',
                    fontSize: '1.2rem',
                    backgroundColor: '#7c5e93',
                    color: '#2C223E',
                    padding: 10,
                    width: '8rem',
                    borderRadius: '50px',
                    border: 0,
                    fontFamily: 'MerriWeather',
                  }} onMouseEnter={handleOver} onMouseLeave={handleLeave}>
                    Stake
                  </button>
                </Link>
              </li>
              <li style={{ visibility: account.address !== '' ? 'visible' : 'hidden' }}>
                <button style={{
                  fontSize: '1.2rem',
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
          <Route exact path="/" element={Main}/>
          <Route exact path="/stake" element={<ValidatorsList account={account}/>}/>
          <Route exact path="/convert" element={Main}/>
        </Routes>
      </Router>
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Pick a chain</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={style.divButton}>
              <Button style={{
                width: '40%',
                height: '50%',
                backgroundColor: '#fff1b3',
                color: '#383838'
              }}
                onClick={() => {
                  connect('dig-1')
                  setShow(false)
                }}>
                Dig
              </Button>
              <Button style={{
                width: '40%',
                height: '50%',
                backgroundColor: '#fff1b3',
                color: '#383838'
              }}
                onClick={() => {
                  connect('eth')
                  setShow(false)
                }}>
                Ethereum
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
}

export default App;