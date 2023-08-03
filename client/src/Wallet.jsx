import server from "./server";
import React, { useEffect } from "react";

function Wallet({
  address,
  setAddress,
  privateKey,
  setPrivateKey,
  isPrivateKeyCorrect,
  setIsPrivateKeyCorrect,
  balance,
  setBalance,
}) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address && isPrivateKeyCorrect) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      // Indicate that this is a new address - unable sending to it?
      setBalance(0);
    }
  }

  async function privateKeyCheck(evt) {
    const privateKey = evt.target.value;
    console.log("Inside privateKeyCheck function: ", privateKey); // add this line
    setPrivateKey(privateKey);
  }

  async function checkKey(evt) {
    console.log("We are trying to start checking the key on the client side.");
    evt.preventDefault();
    console.log("Private key input:" + privateKey);

    try {
      const response = await server.post(`privKeyCheck`, {
        sender: address,
        privKeyInput: privateKey,
      });

      if (response.status === 200) {
        console.log(
          "We received a successful 200 API response from the server."
        );
        setPrivateKeyBoolean();
        console.log("Address:", address);
        try {
          console.log("Before GET request");
          const response = await server.get(`balance/${address}`);
          console.log("Response from server:", response);
          const {
            data: { balance },
          } = response;
          setBalance(balance);
          console.log("Balance after checking key:", balance);
        } catch (ex) {
          console.error("Error while trying to get the balance:", ex);
        }
      } else {
        alert(response.data.message);
      }
    } catch (ex) {
      if (ex.response && ex.response.data) {
        alert(ex.response.data.message);
      } else {
        console.error(ex);
      }
    }
  }

  function setPrivateKeyBoolean() {
    setIsPrivateKeyCorrect(true);
  }

  return (
    <form className="container wallet" onSubmit={checkKey}>
      <h1>Braxits Wallet</h1>
      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={onChange}
        ></input>
      </label>
      <label>
        Private key
        <input
          placeholder="Enter the private key for the address above:"
          value={privateKey}
          onChange={privateKeyCheck}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
      <div className="balance">
        Is private key correct? {String(isPrivateKeyCorrect)}
      </div>
      <input
        type="submit"
        className="button"
        value="Check key against server"
      />
    </form>
  );
}

export default Wallet;
