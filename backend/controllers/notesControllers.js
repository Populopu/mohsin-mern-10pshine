import Note from "../models/notes.js";

export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user });
  res.json(notes);
};
