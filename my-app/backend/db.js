const mongoose = require("mongoose");

const connectToDatabase = async (mongoUri) => {
  console.log("connecting to database URI:", mongoUri);

  try {
    await mongoose.connect(mongoUri);
    console.log("connected to MongoDB");
  } catch (error) {
    console.error("failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = { connectToDatabase };
