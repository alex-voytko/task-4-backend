import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  signUpDate: { type: String, required: true },
  isBlocked: { type: Boolean, required: true },
  isOnline: { type: Boolean, required: true },
  lastVisit: { type: String },
});

export default mongoose.model("User", User);
