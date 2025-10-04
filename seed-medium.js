const mongoose = require("mongoose");
const faker = require("faker");
const Auth = require("./models/Auth");
const Donor = require("./models/Donor");
const Hospital = require("./models/Hospital");
const Donation = require("./models/Donation");
const Emergency = require("./models/Emergency_notification");
const Notification = require("./models/notification");
const BloodCamp = require("./models/Blood_camp");
const BloodCampNotification = require("./models/BloodCampNotification");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/BloodShare", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Blood groups
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// Helper: random point within radius in km
function randomPoint(center, radiusKm) {
  const r = radiusKm / 111; // ~1 deg lat = 111 km
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  return [center[0] + y, center[1] + x]; // [lat, lng]
}

// Medium dataset - 4 cluster centers
const clusterCenters = [
  { name: "Delhi", coords: [28.6139, 77.2090] },
  { name: "Mumbai", coords: [19.0760, 72.8777] },
  { name: "Bangalore", coords: [12.9716, 77.5946] },
  { name: "Chennai", coords: [13.0827, 80.2707] },
];

async function seed() {
  try {
    // Clear old data
    await Promise.all([
      Auth.deleteMany({}),
      Donor.deleteMany({}),
      Hospital.deleteMany({}),
      Donation.deleteMany({}),
      Emergency.deleteMany({}),
      Notification.deleteMany({}),
      BloodCamp.deleteMany({}),
      BloodCampNotification.deleteMany({})
    ]);
    console.log("🧹 Cleared old data");

    // --- Hospitals (4 clusters × 4 hospitals = 16 hospitals) ---
    const hospitals = [];
    clusterCenters.forEach((cluster, idx) => {
      for (let i = 0; i < 4; i++) {
        const coords = randomPoint(cluster.coords, 6); // 6 km radius
        hospitals.push({
          name: `${cluster.name} Hospital ${i + 1}`,
          email: `hospital${idx}${i}@example.com`,
          mobile: "90000" + (1000 + i + idx * 10),
          location: { type: "Point", coordinates: [coords[1], coords[0]] }, // [lng, lat]
          bloodStock: bloodGroups.map(bg => ({
            bloodGroup: bg,
            units: faker.datatype.number({ min: 10, max: 80 }),
          })),
        });
      }
    });
    const hospitalDocs = await Hospital.insertMany(hospitals);
    console.log(`✅ Created ${hospitalDocs.length} hospitals`);

    // --- Donors (150 donors distributed across clusters) ---
    const donors = [];
    for (let i = 0; i < 150; i++) {
      const cluster = faker.random.arrayElement(clusterCenters);
      const coords = randomPoint(cluster.coords, 8); // 8 km radius
      donors.push({
        name: faker.name.findName(),
        email: `donor${i}@example.com`,
        mobile: "8" + faker.phone.phoneNumber("#########"),
        bloodGroup: faker.random.arrayElement(bloodGroups),
        aadhar: String(100000000000 + i),
        location: { type: "Point", coordinates: [coords[1], coords[0]] },
        permanentLocation: { type: "Point", coordinates: [coords[1], coords[0]] },
        active: true,
      });
    }
    const donorDocs = await Donor.insertMany(donors);
    console.log(`✅ Created ${donorDocs.length} donors`);

    // --- Auth users ---
    const authUsers = [
      ...hospitalDocs.map(h => ({ email: h.email, role: "Hospital", refId: h._id })),
      ...donorDocs.map(d => ({ email: d.email, role: "Donor", refId: d._id })),
    ];
    await Auth.insertMany(authUsers);
    console.log(`✅ Created ${authUsers.length} auth users`);

    // --- Donations (2-3 history per donor) ---
    const donations = [];
    for (const donor of donorDocs) {
      const donationCount = faker.datatype.number({ min: 2, max: 3 });
      const donationHistory = [];

      for (let j = 0; j < donationCount; j++) {
        const hospital = faker.random.arrayElement(hospitalDocs);
        donationHistory.push({
          hospital: hospital._id,
          units: faker.datatype.number({ min: 1, max: 2 }),
          bloodGroup: donor.bloodGroup,
          date: faker.date.past(2), // Past 2 years
        });
      }

      donations.push({
        donor: donor._id,
        aadhar: donor.aadhar,
        totalDonations: donationHistory.length,
        lastDonationDate: donationHistory[donationHistory.length - 1].date,
        donationHistory,
      });
    }
    await Donation.insertMany(donations);
    console.log(`✅ Created ${donations.length} donation records`);

    // --- Blood Camps (2-3 per hospital) with better donor distribution ---
    const camps = [];
    for (const hospital of hospitalDocs) {
      const campCount = faker.datatype.number({ min: 2, max: 3 });

      for (let i = 0; i < campCount; i++) {
        // Find nearby donors for this camp (within 8km for better coverage)
        const nearbyDonors = await Donor.find({
          location: {
            $geoWithin: {
              $centerSphere: [hospital.location.coordinates, 8 / 6378.1],
            },
          },
          active: true,
        }).limit(15); // Limit to 15 donors per camp

        camps.push({
          name: `${hospital.name} Blood Camp ${i + 1}`,
          organizer: hospital.name,
          Hospital: hospital._id,
          address: faker.address.streetAddress(),
          location: hospital.location,
          date: faker.date.future(1), // Next year
          timeFrom: faker.random.arrayElement(["09:00 AM", "10:00 AM", "11:00 AM"]),
          timeTo: faker.random.arrayElement(["03:00 PM", "04:00 PM", "05:00 PM"]),
          donorsNotified: nearbyDonors.map(d => d._id),
        });
      }
    }
    const campDocs = await BloodCamp.insertMany(camps);
    console.log(`✅ Created ${campDocs.length} blood camps`);

    // --- Create additional camps to ensure each donor sees 2-3 camps ---
    const additionalCamps = [];
    for (let i = 0; i < 40; i++) { // Create 40 additional camps
      const hospital = faker.random.arrayElement(hospitalDocs);
      const nearbyDonors = await Donor.find({
        location: {
          $geoWithin: {
            $centerSphere: [hospital.location.coordinates, 12 / 6378.1], // 12km radius
          },
        },
        active: true,
      }).limit(12);

      additionalCamps.push({
        name: `Community Blood Camp ${i + 1}`,
        organizer: hospital.name,
        Hospital: hospital._id,
        address: faker.address.streetAddress(),
        location: hospital.location,
        date: faker.date.future(1),
        timeFrom: faker.random.arrayElement(["09:00 AM", "10:00 AM", "11:00 AM"]),
        timeTo: faker.random.arrayElement(["03:00 PM", "04:00 PM", "05:00 PM"]),
        donorsNotified: nearbyDonors.map(d => d._id),
      });
    }
    const additionalCampDocs = await BloodCamp.insertMany(additionalCamps);
    console.log(`✅ Created ${additionalCampDocs.length} additional blood camps`);

    // --- BloodCamp Notifications ---
    const campNotifs = [];
    const allCamps = [...campDocs, ...additionalCampDocs];

    for (const camp of allCamps) {
      for (const donorId of camp.donorsNotified) {
        campNotifs.push({
          camp: camp._id,
          donor: donorId,
          read: faker.datatype.boolean()
        });
      }
    }
    await BloodCampNotification.insertMany(campNotifs);
    console.log(`✅ Created ${campNotifs.length} blood camp notifications`);

    // --- Emergencies (1-3 per hospital) ---
    const emergencies = [];
    for (const hospital of hospitalDocs) {
      const emergencyCount = faker.datatype.number({ min: 1, max: 3 });

      for (let i = 0; i < emergencyCount; i++) {
        const bloodGroup = faker.random.arrayElement(bloodGroups);

        // Find nearby donors with matching blood group
        const nearbyDonors = await Donor.find({
          location: {
            $geoWithin: {
              $centerSphere: [hospital.location.coordinates, 5 / 6378.1],
            },
          },
          bloodGroup,
          active: true,
        });

        // Find nearby hospitals
        const nearbyHospitals = await Hospital.find({
          _id: { $ne: hospital._id },
          location: {
            $geoWithin: {
              $centerSphere: [hospital.location.coordinates, 5 / 6378.1],
            },
          },
        });

        const emergency = {
          bloodGroup,
          unitsNeeded: faker.datatype.number({ min: 2, max: 6 }),
          msg: `Urgent requirement at ${hospital.name}`,
          hospital: hospital._id,
          hospitalLocation: hospital.location,
          donorsNotified: nearbyDonors.map(d => d._id),
          hospitalsNotified: nearbyHospitals.map(h => h._id),
          expiresAt: faker.date.future(0.1),
        };

        const emergencyDoc = await Emergency.create(emergency);

        // Create notifications with messages
        const notifications = [
          ...nearbyDonors.map((d) => ({
            recipientType: "Donor",
            recipientId: d._id,
            emergency: emergencyDoc._id,
            status: "Pending",
            message: `Urgent ${bloodGroup} blood needed at ${hospital.name}. ${emergency.unitsNeeded} units required.`,
          })),
          ...nearbyHospitals.map((h) => ({
            recipientType: "Hospital",
            recipientId: h._id,
            emergency: emergencyDoc._id,
            status: "Pending",
            message: `Emergency blood request from ${hospital.name}. ${bloodGroup} blood needed.`,
          })),
        ];

        const createdNotifications = await Notification.insertMany(notifications);
        emergencyDoc.notifications = createdNotifications.map((n) => n._id);
        await emergencyDoc.save();

        emergencies.push(emergencyDoc);
      }
    }
    console.log(`✅ Created ${emergencies.length} emergencies`);

    // --- Ensure each hospital has 3-5 donations displayed ---
    const hospitalDonations = [];
    let uniqueAadharCounter = 200000000000; // Start from a different range

    for (const hospital of hospitalDocs) {
      const donationCount = faker.datatype.number({ min: 3, max: 5 });

      for (let i = 0; i < donationCount; i++) {
        const bloodGroup = faker.random.arrayElement(bloodGroups);
        const uniqueAadhar = String(uniqueAadharCounter++);

        // Create a new donation record specifically for this hospital
        const newDonation = await Donation.create({
          donor: null, // No specific donor for hospital display
          aadhar: uniqueAadhar,
          totalDonations: faker.datatype.number({ min: 1, max: 3 }),
          lastDonationDate: faker.date.past(1),
          donationHistory: [{
            hospital: hospital._id,
            units: faker.datatype.number({ min: 1, max: 2 }),
            bloodGroup: bloodGroup,
            date: faker.date.past(1),
          }],
        });

        hospitalDonations.push(newDonation);
      }
    }
    console.log(`✅ Created ${hospitalDonations.length} hospital-specific donations`);

    console.log("🎉 Medium dataset created successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Hospitals: ${hospitalDocs.length}`);
    console.log(`   - Donors: ${donorDocs.length}`);
    console.log(`   - Blood Camps: ${allCamps.length}`);
    console.log(`   - Emergencies: ${emergencies.length}`);
    console.log(`   - Total Notifications: ${await Notification.countDocuments()}`);
    console.log(`   - Total Donations: ${await Donation.countDocuments()}`);

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

db.once("open", seed);
