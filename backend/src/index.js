import dotenv from "dotenv";
dotenv.config(); 

import dbConnect from "./db/index.js";
import app from "./app.js";

const port = process.env.PORT || 5000;

dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`your server is running at port no ${port}`);
    });
  })
  .catch((error) => {
    console.log("Db mongo connection FAILED!", error);
  });