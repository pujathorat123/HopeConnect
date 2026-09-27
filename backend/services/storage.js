const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Donation = require("../models/Donation");
const Volunteer = require("../models/Volunteer");
const User = require("../models/User");

const DATA_DIR = path.join(__dirname, "..", "data");
const LOCAL_DB_PATH = path.join(DATA_DIR, "local-db.json");

// Ensure local data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readLocalDb() {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const content = fs.readFileSync(LOCAL_DB_PATH, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Could not read local DB, initializing empty:", err.message);
  }
  return { donations: [], volunteers: [], users: [] };
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Could not write to local DB:", err.message);
  }
}

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// ------------------- DONATIONS -------------------
async function createDonation({ name, email, amount, message }) {
  const donationData = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    amount: Number(amount),
    message: (message || "").trim(),
    createdAt: new Date(),
  };

  if (isDbConnected()) {
    const doc = new Donation(donationData);
    const saved = await doc.save();
    return { id: saved._id.toString(), donation: saved };
  } else {
    const db = readLocalDb();
    const id = "local_don_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const saved = { _id: id, ...donationData };
    db.donations.push(saved);
    writeLocalDb(db);
    return { id, donation: saved };
  }
}

async function getDonations() {
  if (isDbConnected()) {
    return await Donation.find().sort({ createdAt: -1 });
  } else {
    const db = readLocalDb();
    return db.donations || [];
  }
}

// ------------------- VOLUNTEERS -------------------
async function createVolunteer({ name, email, city }) {
  const volunteerData = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    city: city.trim(),
    createdAt: new Date(),
  };

  if (isDbConnected()) {
    const doc = new Volunteer(volunteerData);
    const saved = await doc.save();
    return { id: saved._id.toString(), volunteer: saved };
  } else {
    const db = readLocalDb();
    const id = "local_vol_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const saved = { _id: id, ...volunteerData };
    db.volunteers.push(saved);
    writeLocalDb(db);
    return { id, volunteer: saved };
  }
}

async function getVolunteers() {
  if (isDbConnected()) {
    return await Volunteer.find().sort({ createdAt: -1 });
  } else {
    const db = readLocalDb();
    return db.volunteers || [];
  }
}

// ------------------- USERS & AUTH -------------------
async function createUser({ name, email, password }) {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (isDbConnected()) {
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      throw new Error("USER_EXISTS");
    }
    const userDoc = new User({
      name: cleanName,
      email: cleanEmail,
      password: password,
    });
    const saved = await userDoc.save();
    return { id: saved._id.toString(), name: saved.name, email: saved.email };
  } else {
    const db = readLocalDb();
    const existing = db.users.find((u) => u.email === cleanEmail);
    if (existing) {
      throw new Error("USER_EXISTS");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = "local_usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const newUser = {
      _id: id,
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      createdAt: new Date(),
    };
    db.users.push(newUser);
    writeLocalDb(db);
    return { id, name: cleanName, email: cleanEmail };
  }
}

async function authenticateUser({ email, password }) {
  const cleanEmail = email.trim().toLowerCase();

  if (isDbConnected()) {
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return null;
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null;
    return { id: user._id.toString(), name: user.name, email: user.email };
  } else {
    const db = readLocalDb();
    const user = db.users.find((u) => u.email === cleanEmail);
    if (!user) return null;

    let isMatch = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) return null;
    return { id: user._id, name: user.name, email: user.email };
  }
}

module.exports = {
  isDbConnected,
  createDonation,
  getDonations,
  createVolunteer,
  getVolunteers,
  createUser,
  authenticateUser,
};
