import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../styles/noteForm.css";
import { AVAILABLE_TAGS } from "./constants";

const NoteForm = ({ onSubmit, editingNote, onCancel }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your note here...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"]
          ]
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!quillRef.current) return;

    if (editingNote) {
      setTitle(editingNote.title || "");
      setTags(editingNote.tags || []);
      setPinned(!!editingNote.pinned);
      quillRef.current.root.innerHTML = editingNote.content || "";
    } else {
      setTitle("");
      setTags([]);
      setPinned(false);
      quillRef.current.root.innerHTML = "";
    }
  }, [editingNote]);

  const addTag = (tag) => {
    const cleanTag = tag.trim().toLowerCase();
    if (!cleanTag || tags.includes(cleanTag)) return;
    setTags(prev => [...prev, cleanTag]);
  };

  const removeTag = (tag) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      title,
      content: quillRef.current.root.innerHTML,
      tags,
      pinned
    });
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h3>{editingNote ? "Edit Note" : "Create New Note"}</h3>

      <input
        className="note-title-input"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        className="tag-input"
        placeholder="Type tag and press Enter"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleTagInput}
      />

      <div className="note-tags">
        {tags.map(tag => (
          <span key={tag} className="tag-chip active" onClick={() => removeTag(tag)}>
            {tag} ✕
          </span>
        ))}
      </div>

      <div className="tag-selector">
        {AVAILABLE_TAGS.map(tag => (
          <button
            type="button"
            key={tag}
            className={`tag-chip ${tags.includes(tag) ? "active" : ""}`}
            onClick={() => addTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <label className="pin-checkbox">
        <input
          type="checkbox"
          checked={pinned}
          onChange={(e) => setPinned(e.target.checked)}
        />
        Pin this note
      </label>

      <div ref={editorRef} className="quill-editor" />

      <div className="note-form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="save-btn">
          {editingNote ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
