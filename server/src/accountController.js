/**
 * @module accountController
 * This file contolls each account. It is used to:
 *  Generate accounts
 *  Update account balances
 *  Sign transactions
 *  Verify signatures
 */

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { sign, verify } = secp256k1;

/**
 * A number, or a string containing a number.
 * @typedef {ReturnType<createAccount>} Account
 */

/**
 * This function creates an account
 * @returns the account generated
 */
const createAccount = () => {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const publicKey = secp256k1.getPublicKey(privateKey);
  const address = `0x${toHex(keccak256(publicKey.slice(1)).slice(-20))}`;
  const balance = 100;

  return { privateKey, publicKey, address, balance };
};

/**
 * This function updates the balance of the account given
 * @param {Account} account account to be updated
 * @param {number} difference number in to be added to the accounts balance
 */
const setAccountBalance = (account, difference) => {
  account.balance += difference;
};

/**
 * This function verifies if a signature comes from an account
 * @param {Account} sender
 * @param {string} recipient
 * @param {number} recipient
 * @param {string} signatureStr
 * @returns
 */
const verifySignature = (sender, recipient, amount, signatureStr) => {
  const signature = JSON.parse(signatureStr);

  // convert singature back to proper type
  signature.r = BigInt(signature.r);
  signature.s = BigInt(signature.s);

  const messageHash = keccak256(utf8ToBytes(recipient + amount));

  return verify(signature, messageHash, sender.publicKey);
};

module.exports = {
  createAccount,
  setAccountBalance,
  verifySignature,
};
