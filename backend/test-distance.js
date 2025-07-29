const { calculateDistance, isNearby } = require('./utils/isNearby');

// Test cases for distance calculation
const testCases = [
  {
    name: "Same location",
    lat1: 40.7128, lng1: -74.0060,
    lat2: 40.7128, lng2: -74.0060,
    expectedNearby: true
  },
  {
    name: "Very close (100m)",
    lat1: 40.7128, lng1: -74.0060,
    lat2: 40.7138, lng2: -74.0060,
    expectedNearby: true
  },
  {
    name: "1km away",
    lat1: 40.7128, lng1: -74.0060,
    lat2: 40.7218, lng2: -74.0060,
    expectedNearby: true
  },
  {
    name: "10km away",
    lat1: 40.7128, lng1: -74.0060,
    lat2: 40.8028, lng2: -74.0060,
    expectedNearby: true
  },
  {
    name: "20km away (should be too far)",
    lat1: 40.7128, lng1: -74.0060,
    lat2: 40.9128, lng2: -74.0060,
    expectedNearby: false
  }
];

console.log("🧪 Testing Distance Calculation\n");

testCases.forEach((testCase, index) => {
  const distance = calculateDistance(testCase.lat1, testCase.lng1, testCase.lat2, testCase.lng2);
  const isWithinRange = isNearby(testCase.lat1, testCase.lng1, testCase.lat2, testCase.lng2, 15000);
  
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`  Distance: ${Math.round(distance)} meters (${(distance/1000).toFixed(2)} km)`);
  console.log(`  Within 15km: ${isWithinRange}`);
  console.log(`  Expected: ${testCase.expectedNearby}`);
  console.log(`  ✅ ${isWithinRange === testCase.expectedNearby ? 'PASS' : 'FAIL'}\n`);
});

console.log("🎯 Distance calculation test completed!");