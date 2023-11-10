import "./App.scss";
import { Account } from "./Account";
import { useECDSA } from "./context";

function App() {
  const { accounts } = useECDSA();

  return (
    <div className="app">
      {accounts[0].map((account) => (
        <Account key={account.address} account={account} />
      ))}
    </div>
  );
}

export default App;
