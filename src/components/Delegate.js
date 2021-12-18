import { useEffect, useState } from "react";
import React from "react";
import { getValidators } from "../helpers/getValidators";
import { InputNumber, Radio } from "antd";
import { getBalance } from "../helpers/getBalances";
import { getKeplr, getCosmosClient } from "../helpers/getKeplr";
import {
  Secp256k1HdWallet,
  SigningCosmosClient,
  coins,
  MsgDelegate,
  coin,
} from "@cosmjs/launchpad";

const initData = Object.freeze ({
  validator: "",
  amount: "",
  fee: "",
  memo: ""
})

const Delegate = ({ account }) => {
  const [validators, setValidators] = useState([]);
  
  const [data, updateData] = useState(initData)
  const onChange = (event) => {
    updateData({
      ...data
    })
  }

  const delegate = (e) => {
    console.log(data)
  }

  useEffect(() => {
    (async () => {
      const vals = await getValidators();
      console.log(vals);
      setValidators([...vals]);
    })();
  }, []);

  return (
    <div style={{
            backgroundColor: "#fff",
            borderWidth: 30,
            borderColor: "#123123",
            borderRadius: 10,
            padding: 1,
            textAlign: "justify"
         }}
    >
      <h1>Delegate Token</h1>
      <form>
        <p>Validator</p>
        <input placeholder="Select a Validator" list="validators" onChange={onChange}></input>
        <datalist id="validators">
          {validators.map((val) => (
            <option>{val.description.moniker}</option>
          ))}
        </datalist>
        <p>Address</p>
        <p name="validator"onChange={onChange}>cai nay de lay dia chi tu cac moniker chon o tren nhg e ko bt lay ntn
        </p>
        <p>Amount</p>
        <InputNumber
          name="amount"
          style={{
            width: 200,
          }}
          defaultValue={account.amount}
          min="0"
          max={account.amount}
          step="1"
          onChange={onChange}
          stringMode
        />
        <p>Fee</p>
        <Radio.Group name="fee" defaultValue="800" buttonStyle="solid" onChange={onChange}>
          <Radio.Button value="600">
            <div style={{
                    textAlign: "center",
                    lineHeight: "2" 
                }}
            >
              <p
                style={{
                  fontSize: "10px",
                }}
              >
                Low
              </p>
              <p
                style={{
                  fontSize: "10px",
                }}
              >
                600 udig
              </p>
            </div>
          </Radio.Button>
          <Radio.Button value="800">
            <div style={{
                    textAlign: "center",
                    lineHeight: "2" 
                }}
            >
              <p
                style={{
                  fontSize: "10px",
                }}
              >
                Average
              </p>
              <p
                style={{
                  fontSize: "10px",
                }}
              >
                800 udig
              </p>
            </div></Radio.Button>
          <Radio.Button value="1000">            
            <div style={{
                    textAlign: "center",
                    lineHeight: "2" 
                }}
            >
              <p
                style={{
                  fontSize: "10px",
                }}
              >
                High
              </p>
              <p
                style={{
                  fontSize: "10px",
                }}
              >
                1000 udig
              </p>
            </div></Radio.Button>
        </Radio.Group>
        <button>Cancel</button>
        <button onClick={delegate}>Delegate</button>
      </form>
    </div>
  );
};
export default Delegate;
