import Note from "../models/notes.js";
import logger from "../utils/logger.js";

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
      title,
      content,
      tags,
      pinned
    });

    res.status(201).json(note);
    logger.info(
  {
    userId: req.user.id,
    title: req.body.title
  },
  "Note created"
  );
  } catch (error) {
  logger.error(error, "Failed to create note");
  res.status(500).json({ message: "Failed to create note" });
}
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const { title, content, tags, pinned } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (pinned !== undefined) note.pinned = pinned;

    await note.save();

    res.status(200).json(note);
    logger.info(
  {
    userId: req.user.id,
    noteId: note._id
  },
  "Note updated"
  );
  } catch (error){
    logger.error(error, "Failed to update note");
    res.status(500).json({ message: "Failed to update note" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted" });
    logger.warn(
  {
    userId: req.user.id,
    noteId: req.params.id
  },
  "Note deleted"
  );
  } catch (error){
    logger.error(error, "Failed to delete note");
    res.status(500).json({ message: "Failed to delete note" });
  }
};

export const togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
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
