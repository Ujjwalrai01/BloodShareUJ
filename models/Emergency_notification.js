const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true },
  unitsNeeded: { type: Number, required: true },
  msg: { type: String, required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  hospitalLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  donorsNotified: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donor" }],
  hospitalsNotified: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hospital" }], // new field
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }], // all notifications
  fulfilled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

emergencySchema.index({ hospitalLocation: "2dsphere" });

module.exports = mongoose.model("Emergency", emergencySchema);
