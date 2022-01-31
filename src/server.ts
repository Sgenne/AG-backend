import mongoose from "mongoose";

import app from "./app";

if (!process.env.DB_URI) throw new Error("No database URI set.");

mongoose.connect(process.env.DB_URI).then(() => {
  app.listen(process.env.PORT ? process.env.PORT : 8080);
});
