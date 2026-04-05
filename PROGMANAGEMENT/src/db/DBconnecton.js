import mongoose from "mongoose"
import "dotenv/config"

// mongoose.connect(process.env.MONGO_URL) 
//cause it may bring many error
// - poor connection ->"lags"
// - incorrect url 
// - mongoDB not responsing
// - etc ..

//So instead we use "try-catch" and wrap inside a method to be used where needed

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("✅MongoDB connnected Succesfully");
    } catch (error) {
        console.log("❌MongoDB connection error", error);
        process.exit(1)
    }
}

export default connectDB
