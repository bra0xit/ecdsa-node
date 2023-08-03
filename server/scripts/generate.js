const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils"); //Pulling toHex out of the utils package without importing it all

const privateKey = secp.secp256k1.utils.randomPrivateKey();
const publicKey = secp.secp256k1.getPublicKey(privateKey);

const hexPrivateKey = toHex(privateKey);
const hexPublicKey = toHex(publicKey);

console.log("private Key:", hexPrivateKey);
console.log("public Key:", hexPublicKey);
