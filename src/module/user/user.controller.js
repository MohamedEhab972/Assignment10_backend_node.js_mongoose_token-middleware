import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  loginUser,
  updateUser,
} from "./user.service.js";
import { auth } from "../../common/middleware/auth.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const createdUser = await createUser(req.body);
  res.json(createdUser);
});

router.post("/login", async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
});

router.patch("/update", auth, async (req, res) => {
  const token = req.user;
  const result = await updateUser(token, req.body);
  res.json(result);
});

router.delete("/delete", auth, async (req, res) => {
  const token = req.user;
  const result = await deleteUser(token);
  res.json(result);
});

router.get("/", auth, async (req, res) => {
  const token = req.user;
  const result = await getUserById(token);
  res.json(result);
});

export default router;
