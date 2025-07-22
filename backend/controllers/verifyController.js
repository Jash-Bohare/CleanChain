const { ethers } = require("ethers");
const tokenContract = require("../blockchain/token");
const { db } = require("../firebase/config");
const { sendRewardNotification } = require("../utils/sendEmail"); 

const REWARD_AMOUNT = "10"; // 10 ECO

const rewardCleanup = async (locationId) => {
  try {
    // 1. Get location
    const locationRef = db.collection("locations").doc(locationId);
    const locationDoc = await locationRef.get();

    if (!locationDoc.exists) {
      throw new Error(`Location with ID ${locationId} not found`);
    }

    const location = locationDoc.data();
    const claimedBy = location.claimedBy;

    if (!claimedBy) {
      throw new Error(`Location ${locationId} has no claimedBy field`);
    }

    const normalizedUserId = claimedBy.toLowerCase(); // Normalize address
    const userRef = db.collection("users").doc(normalizedUserId);
    let userDoc = await userRef.get();

    // 2. Fallback if lowercase doc not found
    if (!userDoc.exists) {
      console.warn(`[⚠️ User Not Found] Trying fallback search for: ${claimedBy}`);
      const userQuerySnapshot = await db.collection("users")
        .where("walletAddress", "==", claimedBy)
        .limit(1)
        .get();

      if (!userQuerySnapshot.empty) {
        userDoc = userQuerySnapshot.docs[0];
      } else {
        throw new Error(`User with wallet address ${claimedBy} not found in users collection`);
      }
    }

    const user = userDoc.data();
    const userWallet = user.walletAddress;

    if (!userWallet) {
      throw new Error(`User has no walletAddress in profile`);
    }

    if (location.rewarded) {
      console.log(`[✅ Already Rewarded] Location ${locationId}`);
      return { status: "Already rewarded" };
    }

    console.log(`[🔁 Rewarding] Sending ${REWARD_AMOUNT} ECO to ${userWallet}`);

    // 3. Transfer tokens
    const tx = await tokenContract.transfer(
      userWallet,
      ethers.parseUnits(REWARD_AMOUNT, 18)
    );
    await tx.wait();

    // 4. Update location
    await locationRef.update({
      status: "cleaned",
      rewarded: true,
      cleanedBy: normalizedUserId,
    });

    // 5. Update user tokens
    await db.collection("users").doc(userDoc.id).update({
      tokens: (user.tokens || 0) + parseInt(REWARD_AMOUNT),
      updatedAt: new Date(),
    });

    // 6. Send email notification
    if (user.email) {
      await sendRewardNotification( 
        user.email,
        user.name || "User",
        location.name,
        REWARD_AMOUNT
      );
    } else {
      console.warn(`[📧 Skipped Email] No email found for user ${claimedBy}`);
    }

    console.log(`[✅ Reward Sent] ${REWARD_AMOUNT} ECO → ${userWallet} for location ${locationId}`);
    return { status: "Success", txHash: tx.hash };

  } catch (err) {
    console.error("[❌ Reward Error]:", err.message);
    throw err;
  }
};

module.exports = { rewardCleanup };
