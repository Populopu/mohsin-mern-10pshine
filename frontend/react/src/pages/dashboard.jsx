import { useEffect, useState } from "react";
import { logout, getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/notes", {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <button onClick={logoutHandler}>Logout</button>
      <h2>Your Notes</h2>
      {notes.map(note => (
        <div key={note._id}>
          <h4>{note.title}</h4>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
