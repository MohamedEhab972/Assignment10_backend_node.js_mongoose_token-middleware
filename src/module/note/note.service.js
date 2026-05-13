import mongoose from "mongoose";
import { noteModel } from "../../database/model/note.model.js";

export const createNote = async (data, token) => {
  const { title, content } = data;
  if (!title || !content) {
    return { message: "not created" };
  }
  const note = await noteModel.create({ title, content, userId: token.id });
  return { message: "Note created successfully", data: note };
};

export const updateNote = async (data, token, noteId) => {
  const { title, content } = data;
  const note = await noteModel.findOne({ _id: noteId });
  if (!note) return { message: "Note not found" };
  if (token.id !== note.userId.toString()) {
    return { message: "Unauthorized" };
  }
  if (title) note.title = title;
  if (content) note.content = content;
  await note.save();
  return { message: "Note updated successfully", data: note };
};

export const updateEntireNote = async (data, id, noteId) => {
  const { title, content } = data;
  const note = await noteModel.findOne({ _id: noteId });
  if (!note) return { message: "Note not found" };
  if (id !== note.userId.toString()) {
    return { message: "Unauthorized" };
  }
  if (!title || !content) {
    return { message: "not updated" };
  }
  note.title = title;
  note.content = content;
  await note.save();
  return { message: "Note updated successfully", data: note };
};

export const updateAllTitels = async (id, data) => {
  const { title } = data;
  if (!title) return { message: "Title is required" };
  const result = await noteModel.updateMany({ userId: id }, { title });
  if (result.matchedCount === 0) {
    return { message: "No notes found" };
  }
  return { message: "All notes title updated successfully" };
};

export const deleteNote = async (id, noteId) => {
  const note = await noteModel.findOne({ _id: noteId });
  if (!note) return { message: "Note not found" };
  if (id !== note.userId.toString()) {
    return { message: "Unauthorized" };
  }
  await note.deleteOne();
  return { message: "Note deleted successfully", data: note };
};

export const getPaginatedNotes = async (userId, page, limit) => {
  const skip = (page - 1) * limit;

  const notes = await noteModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (notes.length === 0) {
    return { message: "No notes found" };
  }

  return { message: "Notes retrieved successfully", data: notes };
};

export const getNoteById = async (userId, noteId) => {
  const note = await noteModel.findById(noteId);
  if (!note) return { message: "Note not found" };
  if (userId !== note.userId.toString()) {
    return { message: "Unauthorized" };
  }
  return { message: "Note retrieved successfully", data: note };
};

export const getNoteByContent = async (userId, content) => {
  if (!content) return { message: "Content is required" };

  const note = await noteModel.findOne({ userId, content });
  if (!note) return { message: "Note not found" };

  return { message: "Note retrieved successfully", data: note };
};

export const getNotesWithUser = async (userId) => {
  const notes = await noteModel
    .find({ userId })
    .select("title userId createdAt")
    .populate("userId", "email");

  if (notes.length === 0) {
    return { message: "No notes found" };
  }

  return { message: "Notes retrieved successfully", data: notes };
};

export const aggregateNotes = async (userId, title) => {
  const matchStage = {
    userId: new mongoose.Types.ObjectId(userId),
  };

  if (title) {
    matchStage.title = { $regex: title, $options: "i" };
  }

  const notes = await noteModel.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        title: 1,
        content: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
      },
    },
  ]);

  if (notes.length === 0) {
    return { message: "No notes found" };
  }

  return { message: "Notes retrieved successfully", data: notes };
};

export const deleteAllNotes = async (userId) => {
  const result = await noteModel.deleteMany({ userId });

  if (result.deletedCount === 0) {
    return { message: "No notes found to delete" };
  }

  return { message: "All notes deleted successfully" };
};
