const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load ABI
const abiPath = path.join(__dirname, "../abi/Token.json");
const { abi } = JSON.parse(fs.readFileSync(abiPath, "utf8"));

// Load environment variables
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const tokenAddress = "0xdFD17eE7dD597F7c7De5E15fD4CD63F3B103ef6D"; // Deployed token

const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

module.exports = tokenContract;
