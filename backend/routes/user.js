const express = require('express');
const router = express.Router();
const { db } = require('../firebase/config');
const tokenContract = require('../blockchain/token');

// Get all user locations (claimed, cleaned, verified, etc.)
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
        verified: data.verified || false,
      };

      // Include ALL locations with proper status determination
      let status = "claimed";
      let cleaned = false;
      let afterPhotoUrl = null;
      let afterImageUploaded = false;
      let cleanedBy = null;

      // Determine the actual status based on the data
      if (data.cleaned === true) {
        status = "cleaned";
        cleaned = true;
        afterPhotoUrl = data.afterPhotoUrl || null;
        afterImageUploaded = data.afterImageUploaded || false;
        cleanedBy = data.cleanedBy || null;
      } else if (data.afterPhotoUrl && data.afterImageUploaded) {
        status = "photo_uploaded";
        cleaned = false;
        afterPhotoUrl = data.afterPhotoUrl;
        afterImageUploaded = true;
      } else if (data.claimedBy) {
        status = "claimed";
        cleaned = false;
        afterPhotoUrl = null;
        afterImageUploaded = false;
      }

      // Add verified status if applicable
      if (data.verified === true) {
        status = "verified";
      }

      userLocations.push({
        ...base,
        status,
        cleaned,
        afterPhotoUrl,
        afterImageUploaded,
        cleanedBy,
      });
    });

    // Sort by claimed date (most recent first)
    userLocations.sort((a, b) => new Date(b.claimedAt) - new Date(a.claimedAt));

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
