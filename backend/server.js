const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const storage = require("./services/storage");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Atlas
connectDB();

// Periodically attempt reconnection if disconnected
setInterval(() => {
  if (!storage.isDbConnected()) {
    connectDB();
  }
}, 30000);

// Root / Health Check
const handleRoot = (req, res) => {
  const dbConnected = storage.isDbConnected();
  res.json({
    status: "online",
    message: "HopeConnect Backend is Working!",
    database: {
      connected: dbConnected,
      storageType: dbConnected ? "MongoDB Atlas" : "Local Resilient Storage",
      databaseName: dbConnected ? mongoose.connection.name : "hopeconnect"
    },
    version: "1.0.0",
    endpoints: [
      "/donations",
      "/volunteers",
      "/users",
      "/login",
      "/ngos",
      "/test-db"
    ]
  });
};

app.get("/", handleRoot);
app.get("/api", handleRoot);

// Database Status
const handleTestDb = async (req, res) => {
  const connected = storage.isDbConnected();
  if (connected) {
    try {
      await mongoose.connection.db.admin().ping();
      return res.json({
        success: true,
        message: "MongoDB Atlas is connected successfully!",
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        readyState: mongoose.connection.readyState
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "MongoDB connected but ping failed",
        error: err.message
      });
    }
  } else {
    return res.json({
      success: true,
      message: "MongoDB Atlas is currently offline or IP is not whitelisted. Using local storage fallback.",
      storageType: "local-fallback",
      whitelistTip: "Add your current IP (or 0.0.0.0/0) in MongoDB Atlas Network Access to connect to Atlas directly."
    });
  }
};

app.get("/test-db", handleTestDb);
app.get("/api/test-db", handleTestDb);

// ----------------- DONATIONS -----------------
const handleCreateDonation = async (req, res) => {
  try {
    const { name, email, amount, message } = req.body;

    if (!name || !email || amount === undefined || amount === null || amount === "") {
      return res.status(400).json({
        message: "Please fill all required donation details (name, email, and amount)."
      });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        message: "Please enter a valid donation amount greater than 0."
      });
    }

    const { id, donation } = await storage.createDonation({
      name,
      email,
      amount: numericAmount,
      message
    });

    res.status(201).json({
      message: "Donation saved successfully!",
      donationId: id,
      donation
    });
  } catch (error) {
    console.error("Donation Error:", error);
    res.status(500).json({
      message: "Failed to save donation",
      error: error.message
    });
  }
};

const handleGetDonations = async (req, res) => {
  try {
    const donations = await storage.getDonations();
    res.json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve donations",
      error: error.message
    });
  }
};

app.post("/donations", handleCreateDonation);
app.post("/api/donations", handleCreateDonation);
app.get("/donations", handleGetDonations);
app.get("/api/donations", handleGetDonations);

// ----------------- VOLUNTEERS -----------------
const handleCreateVolunteer = async (req, res) => {
  try {
    const { name, email, city } = req.body;

    if (!name || !email || !city) {
      return res.status(400).json({
        message: "Please fill all volunteer details (name, email, and city)."
      });
    }

    const { id, volunteer } = await storage.createVolunteer({
      name,
      email,
      city
    });

    res.status(201).json({
      message: "Volunteer registration successful!",
      volunteerId: id,
      volunteer
    });
  } catch (error) {
    console.error("Volunteer Error:", error);
    res.status(500).json({
      message: "Failed to register volunteer",
      error: error.message
    });
  }
};

const handleGetVolunteers = async (req, res) => {
  try {
    const volunteers = await storage.getVolunteers();
    res.json({
      success: true,
      count: volunteers.length,
      volunteers
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve volunteers",
      error: error.message
    });
  }
};

app.post("/volunteers", handleCreateVolunteer);
app.post("/api/volunteers", handleCreateVolunteer);
app.get("/volunteers", handleGetVolunteers);
app.get("/api/volunteers", handleGetVolunteers);

// ----------------- USERS / SIGNUP -----------------
const handleCreateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all details (name, email, and password)."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long."
      });
    }

    const result = await storage.createUser({ name, email, password });

    res.status(201).json({
      message: "Account created successfully!",
      userId: result.id,
      user: {
        name: result.name,
        email: result.email
      }
    });
  } catch (error) {
    if (error.message === "USER_EXISTS") {
      return res.status(409).json({
        message: "User already exists. Please login."
      });
    }
    console.error("User Error:", error);
    res.status(500).json({
      message: "Failed to create account",
      error: error.message
    });
  }
};

app.post("/users", handleCreateUser);
app.post("/api/users", handleCreateUser);

// ----------------- LOGIN -----------------
const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password."
      });
    }

    const user = await storage.authenticateUser({ email, password });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    res.status(200).json({
      message: "Login successful! Welcome to HopeConnect.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};

app.post("/login", handleLogin);
app.post("/api/login", handleLogin);

// ----------------- FEATURED NGO -----------------
const featuredNgoData = {
  id: "ngo-sunshine-pune",
  name: "Sunshine Orphanage",
  location: "Pune, Maharashtra",
  founded: 2015,
  childrenSupported: "120+",
  mission: "Providing shelter, nutritious food, education, healthcare, and affection to orphaned and underprivileged children.",
  contact: {
    email: "sunshine.orphanage@gmail.com",
    phone: "+91 98765 43210",
    address: "Survey No. 42, Viman Nagar, Pune, Maharashtra 411014"
  },
  needs: [
    "School textbooks & stationery",
    "Seasonal clothes & shoes",
    "Nutritious dry rations & milk",
    "Basic medicines & health checkups",
    "Toys and sports equipment"
  ]
};

const handleGetNgo = (req, res) => {
  res.json({
    success: true,
    ngo: featuredNgoData
  });
};

app.get("/ngo", handleGetNgo);
app.get("/ngos", handleGetNgo);
app.get("/api/ngo", handleGetNgo);
app.get("/api/ngos", handleGetNgo);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    message: "An internal server error occurred",
    error: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 [HopeConnect] Server running on http://localhost:${PORT}`);
  console.log(`📡 [HopeConnect] Environment: ${process.env.NODE_ENV || "development"}`);
});