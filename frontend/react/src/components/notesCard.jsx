const NoteCard = ({ note, onDelete, onEdit }) => {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>

      <div className="note-actions">
        <button onClick={() => onEdit(note)}>Edit</button>
        <button className="danger" onClick={() => onDelete(note._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
