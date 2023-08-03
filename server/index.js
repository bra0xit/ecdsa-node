const generate = require("./scripts/generate.js");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

// Improvement: Only use the keccak last 20 bytes --> this one is too long, one byte is 2 letters in hex --> 20 bytes = 40 letters
// 0xFF is the largest per-byte value of 255 (0-256 aka 2^8 aka (2^2 = 4)^2)^2 = 2*2*2*2 * 2*2*2*2 (one 2 per slot aka 0 or 1)

const balances = {
  "0x03e21a1a1ac69829c07593a1fcce3c29cc44285d3ff2d76b1e64e3034a62f2abec": 100,
  "0x02ce11fe40da907c421d6898e19ffc07f36bdff3230d77ad88e9de86728580b062": 50,
  "0x0269d081f07a3e80c36634e819a6186f8f29e745f348c7665a6c7b61b00e431f82": 75,
};

const privateKeys = {
  "0x03e21a1a1ac69829c07593a1fcce3c29cc44285d3ff2d76b1e64e3034a62f2abec":
    "d6d561a2897053475dc4b54d035b8b1fac81e844cb3e11601f895c320792c65d",
  "0x02ce11fe40da907c421d6898e19ffc07f36bdff3230d77ad88e9de86728580b062":
    "e6cd02ac33e8d751a7dee870a851acc7d3672cfd576323098d0c49321d623f2e",
  "0x0269d081f07a3e80c36634e819a6186f8f29e745f348c7665a6c7b61b00e431f82":
    "e592b32e840f53658b6bdaaa8cdd6da417695e7654f7f9f029bc0baf8ca2fb36",
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

// remove this - no need to send the privKey to the frontend --> in general VERY bad practice - ideally privkeys
// should not be on server either...
app.get("/private_key/:address", (req, res) => {
  const { address } = req.params;
  const privateKey = privateKeys[address] || 0;
  res.send({ privateKey });
});

app.post("/privKeyCheck", (req, res) => {
  const { sender, privKeyInput } = req.body;

  if (privateKeys[sender] != privKeyInput) {
    console.log(
      "Private key of sender:" + privateKeys[sender],
      "Input:" + privKeyInput
    );
    console.log("We received the wrong private key from the client.");
    res.status(400).send({ message: "Wrong private key!" });
  } else {
    console.log("We received the correct private key from the client.");
    res.status(200).send({ message: "Success!" }); //200 for successful
  }
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  // if the accounts dont exist - might have to check this
  setInitialBalance(sender);
  setInitialBalance(recipient);

  // Add check to make sure the owner actually has the keys to the wallet --> aka knows the private key to the public address (pubkey)

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    // Transaction taking place
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
