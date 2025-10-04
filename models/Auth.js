// models/Auth.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

// Add passport-local-mongoose plugin
authSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('Auth', authSchema);
