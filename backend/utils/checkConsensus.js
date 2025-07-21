const admin = require('firebase-admin');
const db = admin.firestore();

const { ethers } = require('ethers');
const sendEmail = require('./sendEmail');

// Load these from env or constants
const CONTRACT_ADDRESS = '0xYourTokenContractAddressHere';
const ABI = require('../abi/Token.json'); // Place your ABI here

const THRESHOLD_PERCENT = 40;

const checkConsensus = async (locationId, locationData) => {
  try {
    const locationRef = db.collection('locations').doc(locationId);
    const updatedDoc = await locationRef.get();
    const updatedData = updatedDoc.data();

    const votes = updatedData.votes || [];

    const totalVotes = votes.length;
    if (totalVotes < 3) return; // Wait for at least 3 votes before evaluating

    const positiveVotes = votes.filter(v => v.voteType === 'up').length;
    const percentage = (positiveVotes / totalVotes) * 100;

    if (percentage >= THRESHOLD_PERCENT) {
      // Already rewarded? Avoid double reward
      if (updatedData.status === 'verified') return;

      console.log(`✅ Location ${locationId} reached consensus! Rewarding...`);

      // ---- Interact with Smart Contract ----
      const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

      const rewardAmount = updatedData.reward || 10; // fallback reward
      const tx = await contract.transfer(updatedData.claimedBy, ethers.parseUnits(String(rewardAmount), 18));
      await tx.wait();

      console.log(`🎉 Tokens sent to ${updatedData.claimedBy}: ${rewardAmount} ENCD`);

      // ---- Update Firestore ----
      await locationRef.update({
        status: 'verified',
        rewarded: true,
        rewardTx: tx.hash,
      });

      // ---- Send Email Notification ----
      await sendEmail(
        updatedData.claimedByEmail,
        '🎉 Cleanup Verified & Rewarded!',
        `Congrats! Your cleanup for location "${updatedData.title}" has been verified. You've earned ${rewardAmount} ENCD tokens. Tx Hash: ${tx.hash}`
      );
    }
  } catch (err) {
    console.error('❌ Error in consensus check:', err);
  }
};

module.exports = checkConsensus;
