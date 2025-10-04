const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const donorController = require('../controllers/donor');

// Update donor location
router.post('/update-location', wrapAsync(donorController.updateLocation));

// Donor dashboard
router.get('/dashboard', wrapAsync(donorController.dashboard));

router.get('/profile', wrapAsync(donorController.getProfile));
router.post('/toggle-active', wrapAsync(donorController.toggleActive));

router.get("/history", donorController.donorHistory);

// Donor incoming requests
router.get(
  "/requests",
  wrapAsync(donorController.getDonorRequests)
);

router.post(
  "/notifications/:id/action",
  wrapAsync(donorController.updateNotificationStatus)
);


router.get("/camp/notification", donorController.getNotifications);

router.get('/eligibility', wrapAsync(donorController.getEligibility));

router.get('/donordash', wrapAsync(donorController.getDonorDash));

module.exports = router;
