import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders, getUser } from "../utils/auth";
import NoteCard from "../components/notesCard";
import NoteForm from "../components/notesForm";
import ConfirmModal from "../components/confirmModal";
import "../styles/dashboard.css";

const INACTIVITY_LIMIT = 15 * 60 * 1000; 

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); 
  const [selectedTag, setSelectedTag] = useState("");

  const navigate = useNavigate();
  const user = getUser();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/notes", {
        headers: getAuthHeaders()
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch notes");
        return;
      }

      setNotes(data);
    } catch {
      toast.error("Server error while fetching notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    let timeout;

    const logoutUser = () => {
      localStorage.clear();
      navigate("/login", { replace: true });
    };

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logoutUser, INACTIVITY_LIMIT);
    };

    ["mousemove", "keydown", "click", "scroll"].forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();

    return () => {
      clearTimeout(timeout);
      ["mousemove", "keydown", "click", "scroll"].forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [navigate]);

  const handleAddOrUpdate = async (noteData) => {
    if (!noteData.title || !noteData.content) {
      toast.error("Title and content are required");
      return;
    }

    const url = editingNote
      ? `http://localhost:5000/api/notes/${editingNote._id}`
      : "http://localhost:5000/api/notes";

    const method = editingNote ? "PUT" : "POST";

    try {
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
      setShowForm(false);
      fetchNotes();
    } catch {
      toast.error("Server error");
    }
  };

  const requestDelete = (id) => {
    setNoteToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/notes/${noteToDelete}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      toast.success("Note deleted");
      fetchNotes();
    } catch {
      toast.error("Server error");
    } finally {
      setShowConfirm(false);
      setNoteToDelete(null);
    }
  };

  const togglePin = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notes/${id}/pin`,
        {
          method: "PATCH",
          headers: getAuthHeaders()
        }
      );

      if (!res.ok) {
        toast.error("Failed to update pin");
        return;
      }

      fetchNotes();
    } catch {
      toast.error("Server error");
    }
  };

  const filteredNotes = notes
  .filter(note => {
    const plainText = `${note.title} ${note.content}`
      .replace(/<[^>]+>/g, "")
      .toLowerCase();

    if (!plainText.includes(search.toLowerCase())) return false;

    if (filter === "pinned" && !note.pinned) return false;

    if (selectedTag && !note.tags?.includes(selectedTag)) return false;

    return true;
  })
  .sort((a, b) => b.pinned - a.pinned);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const allTags = Array.from(
  new Set(notes.flatMap(note => note.tags || []))
);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Welcome To Dashboard {user?.email} 👋</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>

      <button className="add-note-btn" onClick={() => {
        setEditingNote(null);
        setShowForm(true);
      }}>
        + Add New Note
      </button>

      {showForm && (
        <NoteForm
          onSubmit={handleAddOrUpdate}
          editingNote={editingNote}
          onCancel={() => {
            setEditingNote(null);
            setShowForm(false);
          }}
        />
      )}

      <input
        className="search-input"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filter-bar">
        <button
          className={filter === "all" ? "filter-btn active" : "filter-btn"}
          onClick={() => {
            setFilter("all");
            setSelectedTag("");
          }}
        >
          All
        </button>

        <button
          className={filter === "pinned" ? "filter-btn active" : "filter-btn"}
          onClick={() => {
            setFilter("pinned");
            setSelectedTag("");
          }}
        >
          📌 Pinned
        </button>

        {allTags.length > 0 && (
          <div className="tag-filter">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-chip ${selectedTag === tag ? "active" : ""}`}
                onClick={() => {
                  setSelectedTag(tag);
                  setFilter("all");
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <p className="status-text">Loading notes...</p>}

      <div className="notes-grid">
        {filteredNotes.map(note => (
          <NoteCard
            key={note._id}
            note={note}
            onDelete={requestDelete}
            onEdit={() => {
              setEditingNote(note);
              setShowForm(true);
            }}
            onTogglePin={togglePin}
          />
        ))}
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Delete Note?"
          message="This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
