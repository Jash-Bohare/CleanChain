// backend/scripts/seedLocations.js
const admin = require("firebase-admin");
const serviceAccount = require("../firebase/serviceAccountKey.json"); // <-- replace path

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function seed() {
    const locations = [
        // {
        //   name: "Community Park",
        //   lat: 28.6139,
        //   lng: 77.2090,
        //   beforePhotoUrl: "https://via.placeholder.com/300x200?text=Before+Cleanup",
        //   afterPhotoUrl: null,
        //   rewardTokens: 25,
        //   claimedBy: null,
        //   cleanedBy: null,
        //   claimedAt: null,
        //   cleaned: false,
        // },
        // {
        //   name: "Abandoned Lot",
        //   lat: 28.5239,
        //   lng: 77.0890,
        //   beforePhotoUrl: "https://via.placeholder.com/300x200?text=Before+Cleanup",
        //   afterPhotoUrl: null,
        //   rewardTokens: 50,
        //   claimedBy: null,
        //   cleanedBy: null,
        //   claimedAt: null,
        //   cleaned: false,
        // },
        {
            name: "Pandit Deendayal Energy University",
            lat: 29.5239,
            lng: 79.0890,
            beforePhotoUrl: "https://via.placeholder.com/300x200?text=Before+Cleanup",
            afterPhotoUrl: null,
            rewardTokens: 100,
            claimedBy: null,
            cleanedBy: null,
            claimedAt: null,
            cleaned: false,
        },
        // {
        //   name: "City Lake",
        //   lat: 28.6039,
        //   lng: 77.2000,
        //   beforePhotoUrl: "https://via.placeholder.com/300x200?text=Before+Cleanup",
        //   afterPhotoUrl: null,
        //   rewardTokens: 40,
        //   claimedBy: "0x2",
        //   cleanedBy: null,
        //   claimedAt: new Date().toISOString(),
        //   cleaned: false,
        // },
        // {
        //     name: "Riverside Park",
        //     lat: 28.6039,
        //     lng: 77.2000,
        //     beforePhotoUrl: "https://via.placeholder.com/300x200?text=Before+Cleanup",
        //     afterPhotoUrl: "https://via.placeholder.com/300x200?text=After+Cleanup",
        //     rewardTokens: 70,
        //     claimedBy: "0x1",
        //     cleanedBy: "0x1",
        //     claimedAt: new Date().toISOString(),
        //     cleaned: true,
        // }
    ];

    for (const loc of locations) {
        const docRef = await db.collection("locations").add(loc);
        console.log(`✅ Added: ${loc.name} (id: ${docRef.id})`);
    }

    console.log("🎉 Seeding complete.");
}

seed().catch((err) => {
    console.error("🔥 Seeding failed:", err);
});
