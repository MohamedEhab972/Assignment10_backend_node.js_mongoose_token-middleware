import { Router } from "express";
import { auth } from "../../common/middleware/auth.js";
import {
  aggregateNotes,
  createNote,
  deleteAllNotes,
  deleteNote,
  getNoteByContent,
  getNoteById,
  getNotesWithUser,
  getPaginatedNotes,
  updateAllTitels,
  updateEntireNote,
  updateNote,
} from "./note.service.js";

const router = Router();

router.post("/", auth, async (req, res) => {
  const result = await createNote(req.body, req.user);
  res.json(result);
});

router.get("/paginate-sort", auth, async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await getPaginatedNotes(req.user.id, page, limit);
  res.json(result);
});

router.get("/note-by-content", auth, async (req, res) => {
  const result = await getNoteByContent(req.user.id, req.query.content);
  res.json(result);
});

router.get("/note-with-user", auth, async (req, res) => {
  const result = await getNotesWithUser(req.user.id);
  res.json(result);
});

router.get("/aggregate", auth, async (req, res) => {
  const result = await aggregateNotes(req.user.id, req.query.title);
  res.json(result);
});

router.get("/:noteId", auth, async (req, res) => {
  const result = await getNoteById(req.user.id, req.params.noteId);
  res.json(result);
});

router.patch("/all", auth, async (req, res) => {
  const result = await updateAllTitels(req.user.id, req.body);
  res.json(result);
});

router.patch("/:noteId", auth, async (req, res) => {
  const result = await updateNote(req.body, req.user, req.params.noteId);
  res.json(result);
});

router.put("/:noteId", auth, async (req, res) => {
  const result = await updateEntireNote(
    req.body,
    req.user.id,
    req.params.noteId,
  );
  res.json(result);
});

router.delete("/", auth, async (req, res) => {
  const result = await deleteAllNotes(req.user.id);
  res.json(result);
});

router.delete("/:noteId", auth, async (req, res) => {
  const result = await deleteNote(req.user.id, req.params.noteId);
  res.json(result);
});

export default router;
