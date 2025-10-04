const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const hospitalController = require("../controllers/hospital");
const Hospital = require("../models/Hospital");

router.get('/dashboard', wrapAsync(hospitalController.dashboard));

router.get('/hospitaldash', wrapAsync(hospitalController.getHospitalDash));

// View current stock
router.get("/stocks", wrapAsync(hospitalController.viewStocks));

// Render update stock page
router.get("/stock/update", wrapAsync(hospitalController.renderUpdateStock));

// Update stock submission
router.post("/stock/update", wrapAsync(hospitalController.updateStock));

router.get("/emergency", wrapAsync(hospitalController.getEmergencyForm));
router.post("/emergency", wrapAsync(hospitalController.createEmergency));

// Hospital routes
router.get("/donations", hospitalController.listDonations);
router.post("/donations", hospitalController.addDonation);


router.post('/update-location', async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!req.user || !req.user.refId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await Hospital.findByIdAndUpdate(req.user.refId, {
    location: { type: 'Point', coordinates: [longitude, latitude] }
  });

  res.json({ status: 'Hospital location updated' });
});

// Show blood camp creation form
router.get("/bloodcamp", hospitalController.renderBloodCampForm);

// Handle blood camp creation
router.post("/bloodcamp", hospitalController.createBloodCamp);


// Hospital incoming requests
router.get(
  "/requests",
  wrapAsync(hospitalController.getHospitalRequests)
);

// Hospital sent requests
router.get(
  "/sent",
  wrapAsync(hospitalController.getHospitalSentRequests)
);


router.post(
  "/notifications/:id/action",
  wrapAsync(hospitalController.updateNotificationStatus)
);



module.exports = router;
