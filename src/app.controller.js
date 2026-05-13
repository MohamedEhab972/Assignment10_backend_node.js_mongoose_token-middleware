import express from "express";
import { connectDB } from "./database/connection.js";
import userRouter from "./module/user/user.controller.js";
import noteRouter from "./module/note/note.controller.js";

export const bootstrap = () => {
  const app = express();
  app.use(express.json());
  connectDB();
  app.use("/users", userRouter);
  app.use("/notes", noteRouter);
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};
