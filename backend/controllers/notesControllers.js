import mongoose from "mongoose";
import Note from "../models/notes.js";
import logger from "../utils/logger.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const filterUpdates = (body) => {
  const allowedFields = ["title", "content", "tags", "pinned"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  });

  return updates;
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
      .sort({ pinned: -1, updatedAt: -1 });

    res.status(200).json(notes);
  } catch {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

export const createNote = async (req, res) => {
  const { title, content, tags = [], pinned = false } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required"
    });
  }

  try {
    const note = await Note.create({
      user: req.user.id,
      title: String(title),
      content: String(content),
      tags: Array.isArray(tags) ? tags : [],
      pinned: Boolean(pinned)
    });

    res.status(201).json(note);

    logger.info(
      { userId: req.user.id, title },
      "Note created"
    );

  } catch (error) {
    logger.error(error, "Failed to create note");
    res.status(500).json({ message: "Failed to create note" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findOne({
      _id: id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const updates = filterUpdates(req.body);

    Object.assign(note, updates);

    await note.save();

    res.status(200).json(note);

    logger.info(
      { userId: req.user.id, noteId: note._id },
      "Note updated"
    );

  } catch (error) {
    logger.error(error, "Failed to update note");
    res.status(500).json({ message: "Failed to update note" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findOneAndDelete({
      _id: id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted" });

    logger.warn(
      { userId: req.user.id, noteId: id },
      "Note deleted"
    );

  } catch (error) {
    logger.error(error, "Failed to delete note");
    res.status(500).json({ message: "Failed to delete note" });
  }
};

export const togglePin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findOne({
      _id: id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.pinned = !note.pinned;
    await note.save();

    res.status(200).json(note);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
