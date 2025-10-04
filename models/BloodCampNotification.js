const mongoose = require("mongoose");

const bloodCampNotificationSchema = new mongoose.Schema({
  camp: { type: mongoose.Schema.Types.ObjectId, ref: "BloodCamp", required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
  notifiedAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

bloodCampNotificationSchema.index({ camp: 1, donor: 1 }, { unique: true });

module.exports = mongoose.model("BloodCampNotification", bloodCampNotificationSchema);
