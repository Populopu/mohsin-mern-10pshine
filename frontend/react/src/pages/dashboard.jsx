// import { useEffect, useState } from "react";
// import { logout, getToken } from "../utils/auth";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const [notes, setNotes] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("http://localhost:5000/api/notes", {
//       headers: {
//         Authorization: `Bearer ${getToken()}`
//       }
//     })
//       .then(res => res.json())
//       .then(data => setNotes(data));
//   }, []);

//   const logoutHandler = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div>
//       <button onClick={logoutHandler}>Logout</button>
//       <h2>Your Notes</h2>
//       {notes.map(note => (
//         <div key={note._id}>
//           <h4>{note.title}</h4>
//           <p>{note.content}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAuthHeaders } from "../utils/auth";
import NoteCard from "../components/notesCard";
import NoteForm from "../components/notesForm";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/notes",
        { headers: getAuthHeaders() }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error("Failed to fetch notes");
        return;
      }

      setNotes(data);
    } catch {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddOrUpdate = async (noteData) => {
    const url = editingNote
      ? `http://localhost:5000/api/notes/${editingNote._id}`
      : "http://localhost:5000/api/notes";

    const method = editingNote ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });

    if (!res.ok) {
      toast.error("Operation failed");
      return;
    }

    toast.success(editingNote ? "Note updated" : "Note added");
    setEditingNote(null);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    await fetch(
      `http://localhost:5000/api/notes/${id}`,
      {
        method: "DELETE",
        headers: getAuthHeaders()
      }
    );

    toast.success("Note deleted");
    fetchNotes();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard">
      <header>
        <h2>Welcome 👋</h2>
        <button onClick={logout}>Logout</button>
      </header>

      <NoteForm
        onSubmit={handleAddOrUpdate}
        editingNote={editingNote}
      />

      <div className="notes-grid">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onDelete={handleDelete}
            onEdit={setEditingNote}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
