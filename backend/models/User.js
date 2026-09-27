const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash password if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to verify password (supports both bcrypt and legacy plain-text comparison)
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  // If stored password starts with $2, it is a bcrypt hash
  if (this.password.startsWith("$2a$") || this.password.startsWith("$2b$") || this.password.startsWith("$2y$")) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  // Otherwise compare plain-text
  return this.password === candidatePassword;
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
