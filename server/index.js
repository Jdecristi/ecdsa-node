const express = require("express");
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const {
  createAccount,
  setAccountBalance,
  verifySignature,
} = require("./src/accountController");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const account1 = createAccount();
const account2 = createAccount();
const account3 = createAccount();

const accounts = [account1, account2, account3];

app.get("/accounts", (_, res) => {
  res.send({ accounts });
});

app.post("/transfer", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  const senderAccount = accounts.find((account) => account.address === sender);
  const recipientAccount = accounts.find(
    (account) => account.address === recipient
  );

  const isVarified = verifySignature(
    senderAccount,
    recipient,
    amount,
    signature
  );

  if (!isVarified) {
    res.status(400).send({ message: "Not from sender!" });
  } else if (senderAccount.balance < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    setAccountBalance(senderAccount, -amount);
    setAccountBalance(recipientAccount, amount);

    res.send({
      balance: senderAccount.balance,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
