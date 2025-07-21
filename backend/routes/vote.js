const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

const checkConsensus = require('../utils/checkConsensus');

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

    // Initialize votes array if not present
    const votes = locationData.votes || [];

    // Prevent double-voting
    const hasAlreadyVoted = votes.some(vote => vote.voterId === voterId);
    if (hasAlreadyVoted) {
      return res.status(403).json({ error: 'You have already voted on this location' });
    }

    // Add new vote
    votes.push({ voterId, voteType });
    await locationRef.update({ votes });

    // Check for consensus after vote
    await checkConsensus(locationId, locationData);

    return res.status(200).json({ message: 'Vote submitted successfully' });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
