import { useState, useEffect } from "react";

const NoteForm = ({ onSubmit, editingNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle("");
    setContent("");
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Note title"
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Note content"
        value={content}
        required
        onChange={(e) => setContent(e.target.value)}
      />

      <button type="submit">
        {editingNote ? "Update Note" : "Add Note"}
      </button>
    </form>
  );
};

export default NoteForm;
