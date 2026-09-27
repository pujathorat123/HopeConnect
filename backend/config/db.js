const mongoose = require("mongoose");

// On Windows or environments where local ISP DNS blocks SRV queries,
// set reliable DNS servers for resolving MongoDB Atlas SRV records.
try {
  const dns = require("dns");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore in environments where setting DNS servers is restricted
}

let isConnecting = false;

const connectDB = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("⚠️ [HopeConnect] MONGO_URI is not defined in environment variables. Running in local fallback mode.");
    return;
  }

  isConnecting = true;
  try {
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || "hopeconnect",
      serverSelectionTimeoutMS: 8000,
    });
    console.log("✅ [HopeConnect] MongoDB Atlas connected successfully!");
    console.log("   Database:", mongoose.connection.name);
    console.log("   Host:", mongoose.connection.host);
  } catch (error) {
    console.warn("⚠️ [HopeConnect] MongoDB Atlas connection notice:");
    console.warn(`   Reason: ${error.message}`);
    console.warn("   💡 Tip: If you see SSL alert 80 or MongooseServerSelectionError,");
    console.warn("      whitelist your IP or allow access from anywhere (0.0.0.0/0) in MongoDB Atlas Network Access.");
    console.warn("   ⚡ Backend is running and handling requests with local storage fallback.");
  } finally {
    isConnecting = false;
  }
};

// Monitor connection events
mongoose.connection.on("connected", () => {
  console.log("✅ [HopeConnect] MongoDB Atlas connection state: CONNECTED");
});

mongoose.connection.on("error", (err) => {
  console.warn("⚠️ [HopeConnect] MongoDB connection event error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("ℹ️ [HopeConnect] MongoDB connection state: DISCONNECTED (local fallback active)");
});

module.exports = connectDB;