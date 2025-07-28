const express = require('express');
const router = express.Router();

const { db } = require("../firebase/config");

const { rewardCleanup } = require('../controllers/verifyController');

// POST /vote
router.post('/', async (req, res) => {
  try {
    const { voterId, locationId, voteType } = req.body;

    if (!voterId || !locationId || !voteType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const locationRef = db.collection('locations').doc(locationId);
    const locationDoc = await locationRef.get();

    if (!locationDoc.exists) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const locationData = locationDoc.data();

    // Block self-voting
    if (locationData.claimedBy === voterId) {
      return res.status(403).json({ error: 'You cannot vote on your own cleanup' });
    }

    const votes = locationData.votes || [];

    // Prevent double-voting
    const hasAlreadyVoted = votes.some(vote => vote.voterId === voterId);
    if (hasAlreadyVoted) {
      return res.status(403).json({ error: 'You have already voted on this location' });
    }

    // Add new vote
    votes.push({ voterId, voteType });
    await locationRef.update({ votes });

    // Re-fetch updated document
    const updatedDoc = await locationRef.get();
    const updatedData = updatedDoc.data();
    const updatedVotes = updatedData.votes || [];

    const positiveVotes = updatedVotes.filter(v => v.voteType === 'up').length;
    const VOTE_THRESHOLD = 3;

    console.log(`[Voting Debug] Total yes votes: ${positiveVotes}`);

    if (positiveVotes >= VOTE_THRESHOLD && !updatedData.rewarded) {
      console.log(`[Voting Debug] Threshold met! Triggering reward...`);
      console.log(`[🎯 Vote Count] Upvotes: ${positiveVotes}, Threshold: ${VOTE_THRESHOLD}`);
      // Trigger token reward (this will update 'rewarded', 'status', and 'cleaned')
      await rewardCleanup(locationId);
      // Update 'verified' flag as well
      await locationRef.update({ verified: true });
      console.log(`[✅ Vote Complete] Location ${locationId} has been cleaned and verified`);
    }

    return res.status(200).json({ message: 'Vote submitted successfully' });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
