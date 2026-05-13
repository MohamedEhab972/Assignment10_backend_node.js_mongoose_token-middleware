import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      valedate: {
        validator: function (value) {
          return value !== value.toUpperCase();
        },
        message: "Title should not be in uppercase",
      },
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const noteModel = mongoose.model("Note", noteSchema);
