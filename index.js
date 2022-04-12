import express from "express";
import mongoose from "mongoose";
import router from "./router.js";
import config from "./config.js";
import cors from "cors";

const PORT = process.env.PORT || config.port;
const DB_URL = config.db_url;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/app", router);

async function startApp() {
  try {
    await mongoose.connect(DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    app.listen(PORT, () => console.log("server started on port " + PORT));
  } catch (error) {
    console.log(error);
  }
}
startApp();
