import './App.css';
import { Modal, Button } from 'react-bootstrap';
import { useCallback, useState } from 'react';
import ConnectButton from './components/ConnectButton';

const style = {
  button: {
    marginTop: '25rem',
  }
}

const App = () => {
  const [show, setShow] = useState(false)
  const [chain, setChain] = useState('')

  const wrapSetShow = useCallback((val) => {
    setShow(val)
  }, [setShow])

  const handleClose = () => {
    setShow(false)
  }

  const setChainValue = (val) => {
    setChain(val)
  }

  return (
    <div className="App">
      {
        chain === '' && (
          <div style={style.button}>
            <ConnectButton wrapSetShow={wrapSetShow} />
          </div>
        )
      }
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Pick chain</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button onClick={() => { 
              setChainValue('Dig')
              setShow(false)
              }}>
              Dig
            </Button>
            <Button onClick={() => {
              setChainValue('Dig')
              setShow(false)
              }}>
              Ethereum
            </Button>
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