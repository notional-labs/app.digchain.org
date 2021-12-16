import './App.css';
import { Modal, Button } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import ConnectButton from './components/ConnectButton';
import { getKeplr, } from './helpers/getKeplr';
import { getBalance } from './helpers/getBalances';
import Profile from './components/Profile';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

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
    justifyContent: 'space-evenly',
    padding: 20
  },
  tabButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}

const App = () => {
  const [account, setAccount] = useState({
    address: '',
    amount: '',
  })
  const [pubKey, setPubKey] = useState([])
  const [show, setShow] = useState(false)
  const [chain, setChain] = useState('')

  const wrapSetShow = useCallback((val) => {
    setShow(val)
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
    setChain(val)
  }



  return (
    <div className="App">
      <div style={style.navbar}>
        <div>
          logo
        </div>
        <div>
          <ul style={{...style.tabButton, listStyleType: 'none'}}>
            <li>
              Convert
            </li>
            <li>
              Stake
            </li>
          </ul>
        </div>
      </div>
      {
        chain === '' && (
          <div style={style.button}>
            <ConnectButton wrapSetShow={wrapSetShow} />
          </div>
        )
      }
      {
        chain !== '' && (
          <div>
            <Profile account={account}/>
          </div>
        )
      }
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