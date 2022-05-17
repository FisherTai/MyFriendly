import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import dotenv from "dotenv";
const userRoutes = require("./routes/user-route");
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

// mongoose 6以後不再需要設定useNewUrlParser跟useUnifiedTopology為true
connect(process.env.MONGO_DB_LOCAL!)
  .then(() => {
    console.log("Conntect to Mongo Altas");
  })
  .catch((e: any) => {
    console.log(e);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
