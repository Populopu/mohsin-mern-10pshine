import { Link, useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate("/");
    }
  }, []);

  return (
    <div className="landing">
      <nav className="landing-nav">
        <h2>Notefy</h2>
        <div>
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/signup" className="btn">Signup</Link>
        </div>
      </nav>

      <div className="hero">
        <h1>Organize Your Thoughts,<br />One Note at a Time</h1>
        <p>
          A simple and secure notes app.
          Access your notes anywhere, anytime.
        </p>

        <div className="hero-buttons">
          <Link to="/signup" className="btn large">Get Started</Link>
          <Link to="/login" className="btn-outline large">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
