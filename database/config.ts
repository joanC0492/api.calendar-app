import mongoose, { connect } from "mongoose";

export const dbConnection = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", false); // Da un error
    await connect(process.env.DB_CNN!);
  } catch (error) {
    console.log(error);
    throw new Error("Error al iniciralizar la BD");
  }
};

