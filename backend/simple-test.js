const { calculateDistance, isNearby } = require('./utils/isNearby');

console.log("🧪 Simple Distance Test");

// Test 1: Same location
const distance1 = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);
console.log(`Same location distance: ${distance1} meters`);

// Test 2: 1km away
const distance2 = calculateDistance(40.7128, -74.0060, 40.7218, -74.0060);
console.log(`1km away distance: ${Math.round(distance2)} meters`);

// Test 3: Check if within 15km
const isNearby1 = isNearby(40.7128, -74.0060, 40.7218, -74.0060, 15000);
console.log(`Is 1km away within 15km: ${isNearby1}`);

console.log("✅ Test completed!");