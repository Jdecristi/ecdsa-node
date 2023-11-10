import { useState } from "react";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak";
import { SelectAccount } from "./SelectAccount";
import { useECDSA } from "./context";

const Account = ({ account }) => {
  const { sendTransaction } = useECDSA();

  const [recipientAddress, setRecipientAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [signature, setSignature] = useState();

  const [showPublicKey, seShowPublicKey] = useState(false);
  const [showPrivateKey, seShowPrivateKey] = useState(false);

  const shortendAddress = account.address.slice(0, 30);

  const hanldeSelectRecipient = setRecipientAddress;

  const handleChangeAmount = (e) => setSendAmount(e.target.value);

  const sign = () => {
    const messageHash = keccak256(utf8ToBytes(recipientAddress + sendAmount));

    setSignature(secp256k1.sign(messageHash, account.privateKey));
  };

  const handleClick = () => {
    if (!signature) return sign();

    sendTransaction(
      account.address,
      recipientAddress,
      parseInt(sendAmount),
      signature
    );
    setRecipientAddress("");
    setSendAmount("");
    setSignature();
  };

  return (
    <div className="account">
      <h1 className="title">{shortendAddress}...</h1>
      <div className="account-info">
        <div className="address">
          <span>Balance:</span>
          <span className="value">{account.balance}</span>
        </div>
        <div className="publicKey">
          <span>Public Key:</span>
          <span className="value">
            {showPublicKey ? toHex(account.publicKey) : null}
            <div>
              <button
                className="show-btn"
                onClick={() => seShowPublicKey((prev) => !prev)}
              >
                {showPublicKey ? "Hide" : "Show"}
              </button>
            </div>
          </span>
        </div>
        <div className="privateKey">
          <span>Private Key:</span>
          <span className="value">
            {showPrivateKey ? toHex(account.privateKey) : null}
            <div>
              <button
                className="show-btn"
                onClick={() => seShowPrivateKey((prev) => !prev)}
              >
                {showPrivateKey ? "Hide" : "Show"}
              </button>
            </div>
          </span>
        </div>
      </div>
      <div className="send-transaction">
        <h2 className="label">Send:</h2>
        <div className="select-recipient">
          <label className="select-recipient">
            Select Recipient:
            <SelectAccount
              value={recipientAddress}
              exclude={account.address}
              setValue={hanldeSelectRecipient}
            />
          </label>
        </div>
        <div className="select-amount">
          <label className="select-amount">
            Select Amount to Send:
            <input
              className="input"
              placeholder="Enter amount here"
              value={sendAmount}
              onChange={handleChangeAmount}
            ></input>
          </label>
        </div>
        <button
          className="button"
          disabled={!sendAmount || !recipientAddress}
          onClick={handleClick}
        >
          {signature ? "Send " : "Sign "} Transaction
        </button>
      </div>
    </div>
  );
};

export { Account };
