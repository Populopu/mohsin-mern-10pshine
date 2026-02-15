import React, { useEffect, useState } from "react";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch('/api/notes')
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setNotes(data || []);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  const addNote = async () => {
    try {
      await fetch('/api/notes', { method: 'POST', body: JSON.stringify({ title }), headers: { 'Content-Type': 'application/json' } });
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data || []);
    } catch {}
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      setNotes((s) => s.filter((n) => n._id !== id));
    } catch {}
  };

  return (
    <div>
      <h2>Notes</h2>
      <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={addNote}>Add</button>

      <ul>
        {notes.map((n) => (
          <li key={n._id}>
            <span>{n.title}</span>
            <button onClick={() => deleteNote(n._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
