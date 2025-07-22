const { ethers } = require("ethers");
const tokenContract = require("../blockchain/token");
const { db } = require("../firebase/config");
const sendEmail = require("../utils/sendEmail");

const REWARD_AMOUNT = "10"; // 10 ECO

const rewardCleanup = async (locationId) => {
  try {
    // Fetch location data
    const locationRef = db.collection("locations").doc(locationId);
    const locationDoc = await locationRef.get();

    if (!locationDoc.exists) {
      throw new Error(`Location with ID ${locationId} not found in database`);
    }

    const location = locationDoc.data();
    const userId = location.claimedBy;

    if (!userId) {
      throw new Error(`Location ${locationId} has no claimedBy field`);
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found in users collection`);
    }

    const user = userDoc.data();

    if (location.rewarded) {
      console.log(`[✅ Already rewarded] Location ${locationId}`);
      return { status: "Already rewarded" };
    }

    if (!user.walletAddress) {
      throw new Error(`User ${userId} has no walletAddress in their profile`);
    }

    console.log(`[🔁 Rewarding] Sending ${REWARD_AMOUNT} ECO to ${user.walletAddress}`);

    // Send tokens
    const tx = await tokenContract.transfer(
      user.walletAddress,
      ethers.parseUnits(REWARD_AMOUNT, 18)
    );
    await tx.wait();

    // Update Firestore: mark location as cleaned and rewarded
    await locationRef.update({
      status: "cleaned",
      rewarded: true,
      cleanedBy: userId,
    });

    // Optional: update user's token balance in DB (if you're tracking it off-chain)
    await userRef.update({
      tokens: (user.tokens || 0) + parseInt(REWARD_AMOUNT),
      updatedAt: new Date(),
    });

    // Email notification
    if (user.email) {
      await sendEmail(
        user.email,
        "Cleanup Verified 🎉",
        `Congrats! You’ve earned ${REWARD_AMOUNT} ECO tokens for cleaning "${location.name}". Keep it green! 🌱`
      );
    } else {
      console.warn(`[📧 Skipped Email] No email found for user ${userId}`);
    }

    console.log(`[✅ Reward Sent] ${REWARD_AMOUNT} ECO → ${user.walletAddress} for location ${locationId}`);
    return { status: "Success", txHash: tx.hash };

  } catch (err) {
    console.error("[❌ Reward Error]:", err.message);
    throw err;
  }
};

module.exports = { rewardCleanup };
