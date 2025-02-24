import mongoose from "mongoose";
// import { testAdd, testFind } from "./controllers/Users";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "familyBot",
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // await testAdd();
    // await testFind();
  } catch (error) {
    console.log(error);
  }
};
