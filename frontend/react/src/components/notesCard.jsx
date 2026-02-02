import { formatDate } from "../utils/date";
import "../styles/noteCard.css";

const NoteCard = ({ note, onDelete, onEdit, onTogglePin }) => {
  return (
    <div className={`note-card ${note.pinned ? "pinned" : ""}`}>
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>

        <button
          className="pin-btn"
          onClick={() => onTogglePin(note._id)}
          title={note.pinned ? "Unpin" : "Pin"}
        >
          📌
        </button>
      </div>

      <div
        className="note-content"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />

      {note.tags?.length > 0 && (
        <div className="note-tags">
          {note.tags.map(tag => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="note-actions">
        <button className="edit-btn" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button className="danger" onClick={() => onDelete(note._id)}>
          Delete
        </button>
      </div>

      <div className="note-footer">
        <small>
          {note.updatedAt !== note.createdAt
            ? `Updated ${formatDate(note.updatedAt)}`
            : `Created ${formatDate(note.createdAt)}`}
        </small>
      </div>
    </div>
  );
};

export default NoteCard;
