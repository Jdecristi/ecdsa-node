import { createContext, useContext, useState, useEffect } from "react";

import server from "./server";

const context = createContext(null);

const fetchAccounts = async () => {
  const { accounts } = (await server.get("accounts")).data;

  return accounts.map((account) => ({
    ...account,
    privateKey: Uint8Array.from(Object.values(account.privateKey)),
    publicKey: Uint8Array.from(Object.values(account.publicKey)),
  }));
};

const Provider = ({ children }) => {
  const accounts = useState([]);

  const sendTransaction = async (sender, recipient, amount, signature) => {
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };

    await server.post(`transfer`, {
      sender,
      amount,
      recipient,
      signature: JSON.stringify(signature),
    });

    accounts[1](await fetchAccounts());
  };

  useEffect(() => {
    (async () => {
      accounts[1](await fetchAccounts());
    })();
  }, []);

  return (
    <context.Provider value={{ accounts, sendTransaction }}>
      {children}
    </context.Provider>
  );
};

const useECDSA = () => useContext(context);

export { Provider, useECDSA };
