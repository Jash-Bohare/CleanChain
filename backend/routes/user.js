const express = require('express');
const router = express.Router();
const { db } = require('../firebase/config');
const tokenContract = require('../blockchain/token');

// Get claimed and cleaned locations for a user
router.get('/:userId/locations', async (req, res) => {
  const userId = req.params.userId;

  try {
    const snapshot = await db.collection('locations').where('claimedBy', '==', userId).get();
    const userLocations = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();

      const base = {
        id: doc.id,
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        rewardTokens: data.rewardTokens,
        beforePhotoUrl: data.beforePhotoUrl,
        claimedBy: data.claimedBy,
        claimedAt: data.claimedAt,
        votes: data.votes || [],
        rewarded: data.rewarded || false,
      };

      // Apply the correct status logic based on the cleanup flow
      if (data.cleaned === true) {
        // Location has been cleaned and verified
        userLocations.push({
          ...base,
          status: "cleaned",
          cleaned: true,
          cleanedBy: data.cleanedBy || null,
          afterPhotoUrl: data.afterPhotoUrl || null,
          afterImageUploaded: data.afterImageUploaded || false,
        });
      } else if (data.afterPhotoUrl && data.afterImageUploaded) {
        // Photo uploaded but not yet cleaned/verified
        userLocations.push({
          ...base,
          status: "photo_uploaded",
          cleaned: false,
          afterPhotoUrl: data.afterPhotoUrl,
          afterImageUploaded: true,
        });
      } else if (data.claimedBy) {
        // Just claimed, no photo uploaded yet
        userLocations.push({
          ...base,
          status: "claimed",
          cleaned: false,
          afterPhotoUrl: null,
          afterImageUploaded: false,
        });
      }
    });

    res.status(200).json({ locations: userLocations });
  } catch (error) {
    console.error('Error fetching user locations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's wallet balance from blockchain
router.get('/:userId/balance', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Get ECO token balance from smart contract
    const tokenBalance = await tokenContract.balanceOf(userId);
    const formattedTokenBalance = parseFloat(tokenBalance.toString()) / Math.pow(10, 18); // Convert from wei to tokens

    // Get ETH balance from the network
    const provider = tokenContract.runner.provider;
    const ethBalance = await provider.getBalance(userId);
    const formattedEthBalance = parseFloat(ethBalance.toString()) / Math.pow(10, 18); // Convert from wei to ETH

    res.status(200).json({ 
      tokenBalance: formattedTokenBalance,
      tokenBalanceWei: tokenBalance.toString(),
      ethBalance: formattedEthBalance,
      ethBalanceWei: ethBalance.toString()
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug endpoint to check location data structure
router.get('/:userId/debug', async (req, res) => {
  const userId = req.params.userId;

  try {
    const snapshot = await db.collection('locations').where('claimedBy', '==', userId).get();
    const debugData = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      debugData.push({
        id: doc.id,
        rawData: data,
        status: data.cleaned ? 'cleaned' : data.afterPhotoUrl ? 'photo_uploaded' : 'claimed',
        hasAfterPhoto: !!data.afterPhotoUrl,
        hasAfterImageUploaded: !!data.afterImageUploaded,
        isCleaned: !!data.cleaned,
        isRewarded: !!data.rewarded
      });
    });

    res.status(200).json({ 
      userId,
      totalLocations: debugData.length,
      locations: debugData 
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
