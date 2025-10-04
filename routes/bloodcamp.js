const express = require("express");
const router = express.Router();
const bloodCampController = require("../controllers/bloodcamp");



// View all camps
router.get("/", bloodCampController.listCamps);

// View a single camp
router.get("/:id", bloodCampController.showCamp);


module.exports = router;
